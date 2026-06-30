"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideClient = exports.RideClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class RideClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.ride;
    async getRideDetails(rideId) {
        try {
            const result = await this.get(`${this.baseUrl}/api/v1/rides/${rideId}`);
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching ride details for ride ${rideId}`, error);
            return null;
        }
    }
    async updateRideDriver(rideId, newDriverId) {
        try {
            const result = await this.put(`${this.baseUrl}/api/v1/rides/${rideId}/driver`, { driverId: newDriverId });
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error updating ride driver for ride ${rideId}`, error);
            throw error;
        }
    }
}
exports.RideClient = RideClient;
exports.rideClient = new RideClient();
