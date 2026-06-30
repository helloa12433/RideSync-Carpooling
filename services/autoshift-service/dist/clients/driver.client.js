"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverClient = exports.DriverClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class DriverClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.driver;
    async getDriverDetails(driverId) {
        try {
            const result = await this.get(`${this.baseUrl}/api/v1/drivers/${driverId}`);
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching driver details for driver ${driverId}`, error);
            return null;
        }
    }
}
exports.DriverClient = DriverClient;
exports.driverClient = new DriverClient();
