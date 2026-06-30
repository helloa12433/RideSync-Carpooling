import { bookingRepository } from '../repositories/booking.repository';
import { rideClient } from '../clients/ride.client';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { IBooking } from '../interfaces/booking.interface';
import { logger } from '../config/logger';
import { publishBookingEvent } from '../events/producer';
import { scheduleBookingExpiry } from '../jobs/producer';
import { KAFKA_TOPICS, BOOKING_STATUS } from '../utils/constants';

export class BookingService {
  async createBooking(data: CreateBookingDto): Promise<IBooking> {
    const isAvailable = await rideClient.verifyRideAvailability(data.rideId, data.seats);
    if (!isAvailable) {
      throw new Error('Not enough seats available for this ride');
    }

    const reserved = await rideClient.reserveSeats(data.rideId, data.seats);
    if (!reserved) {
      throw new Error('Failed to reserve seats on ride service');
    }

    const booking = await bookingRepository.create(data);
    logger.info(`Booking created successfully with ID: ${booking.id}`);

    await publishBookingEvent(KAFKA_TOPICS.BOOKING_CREATED, booking);
    await scheduleBookingExpiry(booking.id);

    return booking;
  }

  async getBooking(id: string): Promise<IBooking | null> {
    return bookingRepository.findById(id);
  }

  async cancelBooking(id: string, userId: string): Promise<void> {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (booking.user_id !== userId) throw new Error('Unauthorized to cancel this booking');
    if (booking.status === BOOKING_STATUS.CANCELLED) return;

    await bookingRepository.updateStatus(id, BOOKING_STATUS.CANCELLED);
    logger.info(`Booking ${id} cancelled`);

    await rideClient.releaseSeats(booking.ride_id, booking.seats);
    await publishBookingEvent(KAFKA_TOPICS.BOOKING_CANCELLED, booking);
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return bookingRepository.findByUserId(userId);
  }
}

export const bookingService = new BookingService();
