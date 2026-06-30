import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

export const startRideConsumer = async () => {
  await consumer.subscribe({ topic: 'ride.created', fromBeginning: false });
  await consumer.subscribe({ topic: 'ride.status.updated', fromBeginning: false });
  logger.info('Started Ride Consumer for ride.created and ride.status.updated');
};

export const handleRideEvents = async (topic: string, partition: number, message: any) => {
  if (topic !== 'ride.created' && topic !== 'ride.status.updated') return;

  try {
    const value = message.value?.toString();
    if (!value) return;

    const event = JSON.parse(value);
    
    // Explicitly log every consumed message to terminal as requested
    console.log(`[KAFKA CONSUMER] Notification Service consumed event from topic ${topic}:`, event);
    logger.info(`Received Ride Event from ${topic}`, { eventId: event.id || event.ride_id });

    // RIDE_CREATED notification
    if (topic === 'ride.created') {
      const driverId = event.driver_id;
      if (driverId) {
        emitToUser(driverId, 'notification:ride', { type: 'RIDE_CREATED', message: 'Your ride has been created successfully.', data: event });
      }
    }
    
    // RIDE_STATUS_UPDATED notification
    if (topic === 'ride.status.updated') {
      // In a real app, we might look up the driver/passenger ID based on ride_id if not included
      if (event.status === 'PUBLISHED') {
        emitToUser(event.driver_id, 'notification:ride', { type: 'RIDE_PUBLISHED', message: 'Your ride is now live and searchable.', data: event });
      }
    }
  } catch (error) {
    logger.error('Error processing ride event in notification service', error);
  }
};
