import { rideClient } from '../clients/ride.client';
import { logger } from '../config/logger';

export class EligibilityService {
  /**
   * Checks if the ride is eligible for autoshift.
   * Returns the ride object if eligible, null otherwise.
   */
  async checkEligibility(rideId: string): Promise<{ ride: any; type: 'REPLACEMENT' | 'TRANSFER' } | null> {
    const ride = await rideClient.getRideDetails(rideId);

    if (!ride) {
      logger.warn(`Ride ${rideId} not found. Cannot autoshift.`);
      return null;
    }

    if (ride.status === 'ASSIGNED') {
      logger.info(`Ride ${rideId} is ASSIGNED. Eligible for DRIVER REPLACEMENT.`);
      return { ride, type: 'REPLACEMENT' };
    }

    if (ride.status === 'IN_PROGRESS') {
      logger.info(`Ride ${rideId} is IN_PROGRESS. Eligible for RIDE TRANSFER.`);
      return { ride, type: 'TRANSFER' };
    }

    logger.warn(`Ride ${rideId} has status ${ride.status}. Not eligible for autoshift.`);
    return null;
  }
}

export const eligibilityService = new EligibilityService();
