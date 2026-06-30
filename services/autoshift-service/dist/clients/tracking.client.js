"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingClient = exports.TrackingClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class TrackingClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.tracking;
    async getPassengerLocation(rideId, passengerId) {
        try {
            const result = await this.get(`${this.baseUrl}/api/v1/tracking/${rideId}/state?driverId=none&passengerId=${passengerId}`);
            return result.data?.passengerLocation || null;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching passenger location for ride ${rideId}`, error);
            return null;
        }
    }
    async getDriverLocation(rideId, driverId) {
        try {
            const result = await this.get(`${this.baseUrl}/api/v1/tracking/${rideId}/state?driverId=${driverId}&passengerId=none`);
            return result.data?.driverLocation || null;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching driver location for ride ${rideId}`, error);
            return null;
        }
    }
    async updateTrackingDriver(rideId, newDriverId) {
        try {
            const result = await this.put(`${this.baseUrl}/api/v1/tracking/${rideId}/driver`, {
                driverId: newDriverId,
            });
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error updating tracking driver for ride ${rideId}`, error);
            throw error;
        }
    }
}
exports.TrackingClient = TrackingClient;
exports.trackingClient = new TrackingClient();
