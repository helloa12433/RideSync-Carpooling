import { IBookingClient } from '../interfaces/booking-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class BookingClient extends BaseHttpClient implements IBookingClient {
  private readonly baseUrl = env.services.booking;

  async notifyBookingConfirmed(bookingId: string, driverId: string): Promise<boolean> {
    try {
      await this.post(`${this.baseUrl}/api/v1/bookings/${bookingId}/confirm`, { driverId });
      return true;
    } catch (error) {
      logger.error(`Error notifying booking service for booking ${bookingId}`, error);
      return false;
    }
  }
}

export const bookingClient = new BookingClient();
