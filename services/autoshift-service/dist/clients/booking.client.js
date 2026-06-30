"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingClient = exports.BookingClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class BookingClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.booking;
    async getBookingByRideId(rideId) {
        try {
            const result = await this.get(`${this.baseUrl}/api/v1/bookings/ride/${rideId}`);
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching booking for ride ${rideId}`, error);
            return null;
        }
    }
    async updateBookingDriver(bookingId, newDriverId) {
        try {
            const result = await this.put(`${this.baseUrl}/api/v1/bookings/${bookingId}/driver`, { driverId: newDriverId });
            return result.data;
        }
        catch (error) {
            logger_1.logger.error(`Error updating booking driver for booking ${bookingId}`, error);
            throw error;
        }
    }
}
exports.BookingClient = BookingClient;
exports.bookingClient = new BookingClient();
