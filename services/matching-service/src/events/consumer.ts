import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { matchingService } from '../services/matching.service';
import { redisLocationRepository } from '../repositories/redis-location.repository';
import { KAFKA_TOPICS } from '../utils/constants';

export const startKafkaConsumer = async () => {
  try {
    await kafkaConsumer.subscribe({ topics: [KAFKA_TOPICS.RIDE_CREATED], fromBeginning: true });
    await kafkaConsumer.subscribe({ topics: [KAFKA_TOPICS.RIDE_STATUS_UPDATED], fromBeginning: true });
    await kafkaConsumer.subscribe({ topics: [KAFKA_TOPICS.DRIVER_LOCATION_UPDATE], fromBeginning: true });
    
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const eventData = JSON.parse(value);
        
        if (topic === KAFKA_TOPICS.RIDE_CREATED) {
          logger.info(`Received ${topic} event for ride ${eventData.id}`);
          
          // Index the ride for searching
          const { rideIndexRepository } = await import('../repositories/ride-index.repository');
          await rideIndexRepository.indexRide({
            id: eventData.id,
            driver_id: eventData.driver_id,
            vehicle_id: eventData.vehicle_id,
            source_location: eventData.source_location,
            source_lat: eventData.source_lat,
            source_lng: eventData.source_lng,
            destination_location: eventData.destination_location,
            destination_lat: eventData.destination_lat,
            destination_lng: eventData.destination_lng,
            departure_time: eventData.departure_time,
            estimated_arrival_time: eventData.estimated_arrival_time,
            total_seats: eventData.total_seats,
            available_seats: eventData.available_seats,
            price_per_seat: eventData.price_per_seat,
            status: eventData.status
          });

          // Existing assignment logic for matching passengers to drivers (if applicable)
          await matchingService.processMatching({
            rideId: eventData.id,
            pickupLon: eventData.source_lng,
            pickupLat: eventData.source_lat,
          });
        } 
        else if (topic === KAFKA_TOPICS.RIDE_STATUS_UPDATED) {
          const { rideIndexRepository } = await import('../repositories/ride-index.repository');
          await rideIndexRepository.updateRideStatus(eventData.ride_id, eventData.status);
          
          if (eventData.status === 'PUBLISHED') {
            const { broadcastNewRide } = await import('../websocket/socket.gateway');
            // Re-fetch indexed ride to broadcast full details
            const redisClient = (await import('../config/redis')).redisClient;
            const data = await redisClient.get(`indexed_ride:${eventData.ride_id}`);
            if (data) {
              broadcastNewRide(JSON.parse(data));
            }
          }
        }
        else if (topic === KAFKA_TOPICS.DRIVER_LOCATION_UPDATE) {
          await redisLocationRepository.updateDriverLocation(
            eventData.driverId,
            eventData.lon,
            eventData.lat
          );
        }
      },
    });
  } catch (error) {
    logger.error('Error starting Kafka consumer', error);
  }
};
