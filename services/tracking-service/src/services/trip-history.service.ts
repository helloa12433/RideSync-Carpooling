import { trackingRepository } from '../repositories/tracking.repository';
import { routeService } from './route.service';
import { TRIP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class TripHistoryService {
  async startTripHistory(rideId: string): Promise<void> {
    await trackingRepository.create(rideId);
    logger.info(`Trip history started for ride ${rideId}`);
  }

  async completeTripHistory(rideId: string, status: string = TRIP_STATUS.COMPLETED): Promise<void> {
    const routeString = await routeService.getTripRoute(rideId);
    const distance = await routeService.calculateTotalDistance(rideId);
    
    await trackingRepository.updateStatusAndRoute(rideId, status, routeString, distance);
    logger.info(`Trip history completed for ride ${rideId} with status ${status}`);
  }

  async getTripHistory(rideId: string) {
    return trackingRepository.findByRideId(rideId);
  }
}

export const tripHistoryService = new TripHistoryService();
