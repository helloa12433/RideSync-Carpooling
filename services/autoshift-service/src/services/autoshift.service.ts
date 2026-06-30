import { eligibilityService } from './eligibility.service';
import { driverReplacementService } from './driver-replacement.service';
import { rideTransferService } from './ride-transfer.service';
import { reassignmentService } from './reassignment.service';
import { emergencyService } from './emergency.service';
import { autoshiftRepository } from '../repositories/autoshift.repository';
import { publishAutoshiftStartedEvent, publishAutoshiftCompletedEvent } from '../events/producer';
import { AUTOSHIFT_STATUS, AUTOSHIFT_REASON } from '../utils/constants';
import { logger } from '../config/logger';

const EMERGENCY_REASONS = [
  AUTOSHIFT_REASON.DRIVER_ACCIDENT,
  AUTOSHIFT_REASON.DRIVER_EMERGENCY,
  AUTOSHIFT_REASON.RIDE_EMERGENCY,
];

export class AutoshiftService {
  /**
   * Main entry point. Called by Kafka consumer when a driver/vehicle event arrives.
   *
   * Flow:
   * 1. Acquire lock (prevent duplicate autoshifts per ride)
   * 2. Check ride eligibility via Ride Service
   * 3. If ASSIGNED → Driver Replacement
   * 4. If IN_PROGRESS → Ride Transfer (get passenger location from Tracking first)
   * 5. For emergencies, send priority notifications
   * 6. Release lock
   */
  async handleEvent(rideId: string, driverId: string, reason: string): Promise<void> {
    // 1. Acquire distributed lock
    const lockAcquired = await reassignmentService.acquireLock(rideId);
    if (!lockAcquired) return;

    try {
      // 2. Check eligibility
      const eligibility = await eligibilityService.checkEligibility(rideId);
      if (!eligibility) {
        logger.warn(`Ride ${rideId} not eligible for autoshift`);
        return;
      }

      const { ride, type } = eligibility;

      // 3. Create autoshift record in Cassandra
      const autoshift = await autoshiftRepository.create({
        rideId,
        oldDriverId: driverId,
        reason,
        type,
        status: AUTOSHIFT_STATUS.STARTED,
      });

      await publishAutoshiftStartedEvent({ autoshiftId: autoshift.id, rideId, reason, type });

      // 4. If emergency, send priority notifications first
      if (EMERGENCY_REASONS.includes(reason)) {
        await emergencyService.notifyEmergency(rideId, ride.passengerId, driverId, reason);
      }

      // 5. Route to correct handler
      if (type === 'REPLACEMENT') {
        await driverReplacementService.replace({
          rideId,
          oldDriverId: driverId,
          reason,
          pickupLat: ride.pickupLat,
          pickupLon: ride.pickupLon,
        }, autoshift.id);
      } else {
        await rideTransferService.transfer({
          rideId,
          oldDriverId: driverId,
          passengerId: ride.passengerId,
          reason,
          currentLat: ride.pickupLat,
          currentLon: ride.pickupLon,
        }, autoshift.id);
      }

      logger.info(`AutoShift completed for ride ${rideId}`);
    } catch (error) {
      logger.error(`AutoShift failed for ride ${rideId}`, error);
    } finally {
      // 6. Always release lock
      await reassignmentService.releaseLock(rideId);
    }
  }

  async getAutoshiftHistory(rideId: string) {
    return autoshiftRepository.findByRideId(rideId);
  }

  async getAutoshiftById(autoshiftId: string) {
    return autoshiftRepository.findById(autoshiftId);
  }
}

export const autoshiftService = new AutoshiftService();
