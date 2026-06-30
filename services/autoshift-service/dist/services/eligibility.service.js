"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityService = exports.EligibilityService = void 0;
const ride_client_1 = require("../clients/ride.client");
const logger_1 = require("../config/logger");
class EligibilityService {
    /**
     * Checks if the ride is eligible for autoshift.
     * Returns the ride object if eligible, null otherwise.
     */
    async checkEligibility(rideId) {
        const ride = await ride_client_1.rideClient.getRideDetails(rideId);
        if (!ride) {
            logger_1.logger.warn(`Ride ${rideId} not found. Cannot autoshift.`);
            return null;
        }
        if (ride.status === 'ASSIGNED') {
            logger_1.logger.info(`Ride ${rideId} is ASSIGNED. Eligible for DRIVER REPLACEMENT.`);
            return { ride, type: 'REPLACEMENT' };
        }
        if (ride.status === 'IN_PROGRESS') {
            logger_1.logger.info(`Ride ${rideId} is IN_PROGRESS. Eligible for RIDE TRANSFER.`);
            return { ride, type: 'TRANSFER' };
        }
        logger_1.logger.warn(`Ride ${rideId} has status ${ride.status}. Not eligible for autoshift.`);
        return null;
    }
}
exports.EligibilityService = EligibilityService;
exports.eligibilityService = new EligibilityService();
