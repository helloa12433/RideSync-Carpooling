import { autoshiftRepository } from '../repositories/autoshift.repository';
import { matchingClient } from '../clients/matching.client';
import { rideClient } from '../clients/ride.client';
import { bookingClient } from '../clients/booking.client';
import { notificationClient } from '../clients/notification.client';
import { publishDriverReplacedEvent, publishAutoshiftFailedEvent } from '../events/producer';
import { AUTOSHIFT_STATUS } from '../utils/constants';
import { DriverReplacementDto } from '../dto/driver-replacement.dto';
import { logger } from '../config/logger';

export class DriverReplacementService {
  /**
   * Ride is ASSIGNED but driver became unavailable.
   * Request Matching Service for a new driver.
   * Update Booking + Ride with new driver.
   * Notify passenger + old driver + new driver.
   * Same ride, same booking, same payment.
   */
  async replace(dto: DriverReplacementDto, autoshiftId: string): Promise<void> {
    try {
      // 1. Ask Matching Service for a new driver (GEOSEARCH + ranking happens there)
      const matchResult = await matchingClient.requestNewDriver(
        dto.rideId, dto.pickupLat, dto.pickupLon, dto.oldDriverId
      );

      if (!matchResult || !matchResult.driverId) {
        logger.error(`No replacement driver found for ride ${dto.rideId}`);
        await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.FAILED);
        await publishAutoshiftFailedEvent({ autoshiftId, rideId: dto.rideId, reason: 'No driver available' });
        return;
      }

      const newDriverId = matchResult.driverId;

      // 2. Update Ride Service with new driver
      await rideClient.updateRideDriver(dto.rideId, newDriverId);

      // 3. Update Booking Service with new driver
      const booking = await bookingClient.getBookingByRideId(dto.rideId);
      if (booking) {
        await bookingClient.updateBookingDriver(booking.id, newDriverId);
      }

      // 4. Mark autoshift as completed
      await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.COMPLETED, newDriverId);

      // 5. Publish driver replaced event
      await publishDriverReplacedEvent({
        autoshiftId, rideId: dto.rideId, oldDriverId: dto.oldDriverId, newDriverId,
      });

      // 6. Notify all parties
      await notificationClient.sendNotification(dto.oldDriverId, 'You have been replaced on this ride.');
      await notificationClient.sendNotification(newDriverId, 'You have been assigned a new ride.');
      if (booking?.passengerId) {
        await notificationClient.sendNotification(booking.passengerId, 'A new driver has been assigned to your ride.');
      }

      logger.info(`Driver replacement completed for ride ${dto.rideId}. New driver: ${newDriverId}`);
    } catch (error) {
      logger.error(`Driver replacement failed for ride ${dto.rideId}`, error);
      await autoshiftRepository.updateStatus(autoshiftId, AUTOSHIFT_STATUS.FAILED);
      await publishAutoshiftFailedEvent({ autoshiftId, rideId: dto.rideId, reason: 'Replacement failed' });
    }
  }
}

export const driverReplacementService = new DriverReplacementService();
