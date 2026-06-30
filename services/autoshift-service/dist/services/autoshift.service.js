"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoshiftService = exports.AutoshiftService = void 0;
const eligibility_service_1 = require("./eligibility.service");
const driver_replacement_service_1 = require("./driver-replacement.service");
const ride_transfer_service_1 = require("./ride-transfer.service");
const reassignment_service_1 = require("./reassignment.service");
const emergency_service_1 = require("./emergency.service");
const autoshift_repository_1 = require("../repositories/autoshift.repository");
const producer_1 = require("../events/producer");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
const EMERGENCY_REASONS = [
    constants_1.AUTOSHIFT_REASON.DRIVER_ACCIDENT,
    constants_1.AUTOSHIFT_REASON.DRIVER_EMERGENCY,
    constants_1.AUTOSHIFT_REASON.RIDE_EMERGENCY,
];
class AutoshiftService {
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
    async handleEvent(rideId, driverId, reason) {
        // 1. Acquire distributed lock
        const lockAcquired = await reassignment_service_1.reassignmentService.acquireLock(rideId);
        if (!lockAcquired)
            return;
        try {
            // 2. Check eligibility
            const eligibility = await eligibility_service_1.eligibilityService.checkEligibility(rideId);
            if (!eligibility) {
                logger_1.logger.warn(`Ride ${rideId} not eligible for autoshift`);
                return;
            }
            const { ride, type } = eligibility;
            // 3. Create autoshift record in Cassandra
            const autoshift = await autoshift_repository_1.autoshiftRepository.create({
                rideId,
                oldDriverId: driverId,
                reason,
                type,
                status: constants_1.AUTOSHIFT_STATUS.STARTED,
            });
            await (0, producer_1.publishAutoshiftStartedEvent)({ autoshiftId: autoshift.id, rideId, reason, type });
            // 4. If emergency, send priority notifications first
            if (EMERGENCY_REASONS.includes(reason)) {
                await emergency_service_1.emergencyService.notifyEmergency(rideId, ride.passengerId, driverId, reason);
            }
            // 5. Route to correct handler
            if (type === 'REPLACEMENT') {
                await driver_replacement_service_1.driverReplacementService.replace({
                    rideId,
                    oldDriverId: driverId,
                    reason,
                    pickupLat: ride.pickupLat,
                    pickupLon: ride.pickupLon,
                }, autoshift.id);
            }
            else {
                await ride_transfer_service_1.rideTransferService.transfer({
                    rideId,
                    oldDriverId: driverId,
                    passengerId: ride.passengerId,
                    reason,
                    currentLat: ride.pickupLat,
                    currentLon: ride.pickupLon,
                }, autoshift.id);
            }
            logger_1.logger.info(`AutoShift completed for ride ${rideId}`);
        }
        catch (error) {
            logger_1.logger.error(`AutoShift failed for ride ${rideId}`, error);
        }
        finally {
            // 6. Always release lock
            await reassignment_service_1.reassignmentService.releaseLock(rideId);
        }
    }
    async getAutoshiftHistory(rideId) {
        return autoshift_repository_1.autoshiftRepository.findByRideId(rideId);
    }
    async getAutoshiftById(autoshiftId) {
        return autoshift_repository_1.autoshiftRepository.findById(autoshiftId);
    }
}
exports.AutoshiftService = AutoshiftService;
exports.autoshiftService = new AutoshiftService();
