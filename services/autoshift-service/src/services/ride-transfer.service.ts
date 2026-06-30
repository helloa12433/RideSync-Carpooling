import { autoshiftRepository } from '../repositories/autoshift.repository';
import { matchingClient } from '../clients/matching.client';
import { rideClient } from '../clients/ride.client';
import { bookingClient } from '../clients/booking.client';
import { trackingClient } from '../clients/tracking.client';
import { notificationClient } from '../clients/notification.client';
import { publishRideTransferredEvent, publishAutoshiftFailedEvent } from '../events/producer';
import { AUTOSHIFT_STATUS } from '../utils/constants';
import { RideTransferDto } from '../dto/ride-transfer.dto';
import { logger } from '../config/logger';

export class RideTransferService {
  /**
   * Ride is IN_PROGRESS. Driver/vehicle became unavailable mid-trip.
   * Get passenger's current location from Tracking Service.
   * Ask Matching Service for nearest available driver.
   * Transfer the SAME ride to the new driver.
   * No new booking. No new payment. No new ride.
   */
  async transfer(dto: RideTransferDto, autoshiftId: string): Promise<void> {
    try {
      // 1. Get current passenger location from Tracking Service
      const passengerLoc = await trackingClient.getPassengerLocation(dto.rideId, dto.passengerId);
      const searchLat = passengerLoc?.lat ?? dto.currentLat;
      const searchLon = passengerLoc?.lon ?? dto.currentLon;

      // 2. Ask Matching Service for nearest driver (GEOSEARCH + ranking happens there)
      const matchResult = await matchingClient.requestNewDriver(
        dto.rideId, searchLat, searchLon, dto.oldDriverId
      );

      if (!matchResult || !matchResult.driverId) {
        logger.error(`No replacement driver found for in-progress ride ${dto.rideId}`);
        await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.FAILED);
        await publishAutoshiftFailedEvent({ autoshiftId, rideId: dto.rideId, reason: 'No driver available for transfer' });
        return;
      }

      const newDriverId = matchResult.driverId;

      // 3. Update Ride Service — same ride, new driver
      await rideClient.updateRideDriver(dto.rideId, newDriverId);

      // 4. Update Booking Service — same booking, new driver
      const booking = await bookingClient.getBookingByRideId(dto.rideId);
      if (booking) {
        await bookingClient.updateBookingDriver(booking.id, newDriverId);
      }

      // 5. Update Tracking Service — switch live tracking to new driver
      await trackingClient.updateTrackingDriver(dto.rideId, newDriverId);

      // 6. Mark autoshift as completed
      await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.COMPLETED, newDriverId);

      // 7. Publish ride transferred event
      await publishRideTransferredEvent({
        autoshiftId, rideId: dto.rideId, oldDriverId: dto.oldDriverId, newDriverId,
      });

      // 8. Notify all parties
      await notificationClient.sendNotification(dto.oldDriverId, 'Your ride has been transferred to another driver.');
      await notificationClient.sendNotification(newDriverId, 'You have been assigned an in-progress ride. Please proceed to the passenger.');
      await notificationClient.sendNotification(dto.passengerId, 'A new driver is on the way to continue your ride. Your ride details remain the same.');

      logger.info(`Ride transfer completed for ride ${dto.rideId}. New driver: ${newDriverId}`);
    } catch (error) {
      logger.error(`Ride transfer failed for ride ${dto.rideId}`, error);
      await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.FAILED);
      await publishAutoshiftFailedEvent({ autoshiftId, rideId: dto.rideId, reason: 'Transfer failed' });
    }
  }
}

export const rideTransferService = new RideTransferService();
