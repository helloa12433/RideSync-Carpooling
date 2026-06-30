import { bookingRepository } from '../repositories/booking.repository';
import { rideClient } from '../clients/ride.client';
import { BOOKING_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class BookingExpiryService {
  async expireBooking(bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) return;

    if (booking.status === BOOKING_STATUS.PENDING) {
      logger.info(`Booking ${bookingId} has expired. Cancelling...`);
      await bookingRepository.updateStatus(bookingId, BOOKING_STATUS.CANCELLED);
      await rideClient.releaseSeats(booking.ride_id, booking.seats);
    }
  }
}

export const bookingExpiryService = new BookingExpiryService();
