"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchingClient = exports.MatchingClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class MatchingClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.matching;
    async requestNewDriver(rideId, pickupLat, pickupLon, excludeDriverId) {
        try {
            const result = await this.post(`${this.baseUrl}/api/v1/matching/autoshift`, {
                rideId,
                pickupLat,
                pickupLon,
                excludeDriverId,
            });
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error requesting new driver from Matching Service for ride ${rideId}`, error);
            throw error;
        }
    }
}
exports.MatchingClient = MatchingClient;
exports.matchingClient = new MatchingClient();
