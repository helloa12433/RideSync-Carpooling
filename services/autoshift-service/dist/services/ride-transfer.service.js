"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideTransferService = exports.RideTransferService = void 0;
const autoshift_repository_1 = require("../repositories/autoshift.repository");
const matching_client_1 = require("../clients/matching.client");
const ride_client_1 = require("../clients/ride.client");
const booking_client_1 = require("../clients/booking.client");
const tracking_client_1 = require("../clients/tracking.client");
const notification_client_1 = require("../clients/notification.client");
const producer_1 = require("../events/producer");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
class RideTransferService {
    /**
     * Ride is IN_PROGRESS. Driver/vehicle became unavailable mid-trip.
     * Get passenger's current location from Tracking Service.
     * Ask Matching Service for nearest available driver.
     * Transfer the SAME ride to the new driver.
     * No new booking. No new payment. No new ride.
     */
    async transfer(dto, autoshiftId) {
        try {
            // 1. Get current passenger location from Tracking Service
            const passengerLoc = await tracking_client_1.trackingClient.getPassengerLocation(dto.rideId, dto.passengerId);
            const searchLat = passengerLoc?.lat ?? dto.currentLat;
            const searchLon = passengerLoc?.lon ?? dto.currentLon;
            // 2. Ask Matching Service for nearest driver (GEOSEARCH + ranking happens there)
            const matchResult = await matching_client_1.matchingClient.requestNewDriver(dto.rideId, searchLat, searchLon, dto.oldDriverId);
            if (!matchResult || !matchResult.driverId) {
                logger_1.logger.error(`No replacement driver found for in-progress ride ${dto.rideId}`);
                await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.FAILED);
                await (0, producer_1.publishAutoshiftFailedEvent)({ autoshiftId, rideId: dto.rideId, reason: 'No driver available for transfer' });
                return;
            }
            const newDriverId = matchResult.driverId;
            // 3. Update Ride Service — same ride, new driver
            await ride_client_1.rideClient.updateRideDriver(dto.rideId, newDriverId);
            // 4. Update Booking Service — same booking, new driver
            const booking = await booking_client_1.bookingClient.getBookingByRideId(dto.rideId);
            if (booking) {
                await booking_client_1.bookingClient.updateBookingDriver(booking.id, newDriverId);
            }
            // 5. Update Tracking Service — switch live tracking to new driver
            await tracking_client_1.trackingClient.updateTrackingDriver(dto.rideId, newDriverId);
            // 6. Mark autoshift as completed
            await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.COMPLETED, newDriverId);
            // 7. Publish ride transferred event
            await (0, producer_1.publishRideTransferredEvent)({
                autoshiftId, rideId: dto.rideId, oldDriverId: dto.oldDriverId, newDriverId,
            });
            // 8. Notify all parties
            await notification_client_1.notificationClient.sendNotification(dto.oldDriverId, 'Your ride has been transferred to another driver.');
            await notification_client_1.notificationClient.sendNotification(newDriverId, 'You have been assigned an in-progress ride. Please proceed to the passenger.');
            await notification_client_1.notificationClient.sendNotification(dto.passengerId, 'A new driver is on the way to continue your ride. Your ride details remain the same.');
            logger_1.logger.info(`Ride transfer completed for ride ${dto.rideId}. New driver: ${newDriverId}`);
        }
        catch (error) {
            logger_1.logger.error(`Ride transfer failed for ride ${dto.rideId}`, error);
            await autoshift_repository_1.autoshiftRepository.updateStatus(autoshiftId, constants_1.AUTOSHIFT_STATUS.FAILED);
            await (0, producer_1.publishAutoshiftFailedEvent)({ autoshiftId, rideId: dto.rideId, reason: 'Transfer failed' });
        }
    }
}
exports.RideTransferService = RideTransferService;
exports.rideTransferService = new RideTransferService();
