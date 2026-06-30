import { IBookingClient } from '../interfaces/booking-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class BookingClient extends BaseHttpClient implements IBookingClient {
  private readonly baseUrl = env.services.booking;

  async getBookingDetails(bookingId: string): Promise<any> {
    try {
      const result = await this.get<any>(`${this.baseUrl}/api/v1/bookings/${bookingId}`);
      return result.data;
    } catch (error) {
      logger.error(`Error fetching booking details for booking ${bookingId}`, error);
      return null;
    }
  }
}

export const bookingClient = new BookingClient();
