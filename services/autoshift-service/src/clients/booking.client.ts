import { IBookingClient } from '../interfaces/booking-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class BookingClient extends BaseHttpClient implements IBookingClient {
  private readonly baseUrl = env.services.booking;

  async getBookingByRideId(rideId: string): Promise<any> {
    try {
      const result = await this.get<any>(`${this.baseUrl}/api/v1/bookings/ride/${rideId}`);
      return result.data;
    } catch (error) {
      logger.error(`Error fetching booking for ride ${rideId}`, error);
      return null;
    }
  }

  async updateBookingDriver(bookingId: string, newDriverId: string): Promise<any> {
    try {
      const result = await this.put<any>(`${this.baseUrl}/api/v1/bookings/${bookingId}/driver`, { driverId: newDriverId });
      return result.data;
    } catch (error) {
      logger.error(`Error updating booking driver for booking ${bookingId}`, error);
      throw error;
    }
  }
}

export const bookingClient = new BookingClient();
