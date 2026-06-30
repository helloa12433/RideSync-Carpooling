"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverReplacementService = exports.DriverReplacementService = void 0;
const autoshift_repository_1 = require("../repositories/autoshift.repository");
const matching_client_1 = require("../clients/matching.client");
const ride_client_1 = require("../clients/ride.client");
const booking_client_1 = require("../clients/booking.client");
const notification_client_1 = require("../clients/notification.client");
const producer_1 = require("../events/producer");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
class DriverReplacementService {
    /**
     * Ride is ASSIGNED but driver became unavailable.
     * Request Matching Service for a new driver.
     * Update Booking + Ride with new driver.
     * Notify passenger + old driver + new driver.
     * Same ride, same booking, same payment.
     */
    async replace(dto, autoshiftId) {
        try {
            // 1. Ask Matching Service for a new driver (GEOSEARCH + ranking happens there)
            const matchResult = await matching_client_1.matchingClient.requestNewDriver(dto.rideId, dto.pickupLat, dto.pickupLon, dto.oldDriverId);
            if (!matchResult || !matchResult.driverId) {
                logger_1.logger.error(`No replacement driver found for ride ${dto.rideId}`);
                await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.FAILED);
                await (0, producer_1.publishAutoshiftFailedEvent)({ autoshiftId, rideId: dto.rideId, reason: 'No driver available' });
                return;
            }
            const newDriverId = matchResult.driverId;
            // 2. Update Ride Service with new driver
            await ride_client_1.rideClient.updateRideDriver(dto.rideId, newDriverId);
            // 3. Update Booking Service with new driver
            const booking = await booking_client_1.bookingClient.getBookingByRideId(dto.rideId);
            if (booking) {
                await booking_client_1.bookingClient.updateBookingDriver(booking.id, newDriverId);
            }
            // 4. Mark autoshift as completed
            await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.COMPLETED, newDriverId);
            // 5. Publish driver replaced event
            await (0, producer_1.publishDriverReplacedEvent)({
                autoshiftId, rideId: dto.rideId, oldDriverId: dto.oldDriverId, newDriverId,
            });
            // 6. Notify all parties
            await notification_client_1.notificationClient.sendNotification(dto.oldDriverId, 'You have been replaced on this ride.');
            await notification_client_1.notificationClient.sendNotification(newDriverId, 'You have been assigned a new ride.');
            if (booking?.passengerId) {
                await notification_client_1.notificationClient.sendNotification(booking.passengerId, 'A new driver has been assigned to your ride.');
            }
            logger_1.logger.info(`Driver replacement completed for ride ${dto.rideId}. New driver: ${newDriverId}`);
        }
        catch (error) {
            logger_1.logger.error(`Driver replacement failed for ride ${dto.rideId}`, error);
            await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.FAILED);
            await (0, producer_1.publishAutoshiftFailedEvent)({ autoshiftId, rideId: dto.rideId, reason: 'Replacement failed' });
        }
    }
}
exports.DriverReplacementService = DriverReplacementService;
exports.driverReplacementService = new DriverReplacementService();
