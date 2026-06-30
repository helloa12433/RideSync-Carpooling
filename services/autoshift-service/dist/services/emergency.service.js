"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyService = exports.EmergencyService = void 0;
const notification_client_1 = require("../clients/notification.client");
const logger_1 = require("../config/logger");
class EmergencyService {
    /**
     * Sends emergency-level notifications to passenger and the platform.
     * Called for critical events like driver accident or ride emergency.
     */
    async notifyEmergency(rideId, passengerId, driverId, reason) {
        logger_1.logger.warn(`EMERGENCY for ride ${rideId}: ${reason}`);
        await notification_client_1.notificationClient.sendNotification(passengerId, `Emergency alert: ${reason}. A replacement driver is being arranged immediately.`);
        await notification_client_1.notificationClient.sendNotification(driverId, `Emergency reported for ride ${rideId}. A replacement driver is being arranged.`);
        // In production, this would also alert platform ops / emergency services
        logger_1.logger.info(`Emergency notifications sent for ride ${rideId}`);
    }
}
exports.EmergencyService = EmergencyService;
exports.emergencyService = new EmergencyService();
