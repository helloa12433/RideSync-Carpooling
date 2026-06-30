import { matchingRepository } from '../repositories/matching.repository';
import { driverClient } from '../clients/driver.client';
import { bookingClient } from '../clients/booking.client';
import { notificationClient } from '../clients/notification.client';
import { rideClient } from '../clients/ride.client';
import { publishDriverAssignedEvent } from '../events/producer';
import { MATCHING_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class AssignmentService {
  async assignDriver(matchingId: string, rideId: string, driverId: string): Promise<boolean> {
    try {
      logger.info(`Assigning driver ${driverId} to ride ${rideId}`);
      
      // Update Matching Status
      await matchingRepository.updateStatusAndDriver(matchingId, MATCHING_STATUS.COMPLETED, driverId);

      // Update Ride Status
      await rideClient.updateRideStatus(rideId, 'DRIVER_ASSIGNED', driverId);

      // Notify Driver Service
      await driverClient.updateDriverStatus(driverId, 'ON_TRIP');

      // Publish Event
      await publishDriverAssignedEvent({ rideId, driverId });

      // In a real system, we'd fetch the user ID from the ride details
      // For this example, sending a notification mock
      await notificationClient.sendNotification('user_id_placeholder', `Driver assigned to your ride!`);

      return true;
    } catch (error) {
      logger.error(`Assignment failed for matching ${matchingId}`, error);
      await matchingRepository.updateStatusAndDriver(matchingId, MATCHING_STATUS.FAILED);
      return false;
    }
  }
}

export const assignmentService = new AssignmentService();
