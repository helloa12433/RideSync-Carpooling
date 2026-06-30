import { redisLocationRepository } from '../repositories/redis-location.repository';
import { socketManager } from '../websocket/socket-manager';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { logger } from '../config/logger';
import { publishDriverLocationEvent } from '../events/producer';

export class LocationService {
  async updateDriverLocation(data: UpdateLocationDto): Promise<void> {
    try {
      await redisLocationRepository.setLocation('driver', data.driverId, data.lat, data.lon);
      await redisLocationRepository.appendToRoute(data.rideId, data.lat, data.lon);
      
      // Broadcast via WebSockets to subscribers of this ride
      socketManager.broadcastLocation(data.rideId, {
        lat: data.lat,
        lon: data.lon,
        driverId: data.driverId,
      });

      // Also publish to Kafka if other microservices (like matching) need it
      await publishDriverLocationEvent({ driverId: data.driverId, lat: data.lat, lon: data.lon });
    } catch (error) {
      logger.error(`Error updating driver location for ride ${data.rideId}`, error);
    }
  }

  async updatePassengerLocation(rideId: string, passengerId: string, lat: number, lon: number): Promise<void> {
    try {
      await redisLocationRepository.setLocation('passenger', passengerId, lat, lon);
    } catch (error) {
      logger.error(`Error updating passenger location for ride ${rideId}`, error);
    }
  }

  async getDriverLocation(driverId: string) {
    return redisLocationRepository.getLocation('driver', driverId);
  }

  async getPassengerLocation(passengerId: string) {
    return redisLocationRepository.getLocation('passenger', passengerId);
  }
}

export const locationService = new LocationService();
