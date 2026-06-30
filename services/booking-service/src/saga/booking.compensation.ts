import { bookingRepository } from '../repositories/booking.repository';
import { rideClient } from '../clients/ride.client';
import { logger } from '../config/logger';
import { publishBookingEvent } from '../events/producer';
import { KAFKA_TOPICS, BOOKING_STATUS } from '../utils/constants';
import { publishJob } from '../jobs/producer';
import { RABBITMQ_QUEUES } from '../utils/constants';

export class BookingCompensation {
  public async compensatePaymentFailure(bookingId: string, reason: string): Promise<void> {
    logger.warn(`[Saga] Triggering compensation for Booking ${bookingId} due to payment failure: ${reason}`);
    
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      logger.error(`[Saga] Compensation failed: Booking ${bookingId} not found`);
      return;
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) return;

    // 1. Release reserved seats in Ride Service
    try {
      await rideClient.releaseSeats(booking.ride_id, booking.seats);
      logger.info(`[Saga] Seats released for ride ${booking.ride_id}`);
    } catch (error) {
      logger.error(`[Saga] Failed to release seats during compensation for booking ${bookingId}`, error);
    }

    // 2. Update booking status
    await bookingRepository.updateStatus(bookingId, BOOKING_STATUS.CANCELLED);

    // 3. Publish cancellation event
    await publishBookingEvent(KAFKA_TOPICS.BOOKING_CANCELLED, { ...booking, status: BOOKING_STATUS.CANCELLED, cancelReason: reason });
    logger.info(`[Saga] Compensation complete for Booking ${bookingId}`);
  }

  public async handleRideCancellation(rideId: string, reason: string): Promise<void> {
    logger.warn(`[Saga] Handling ride cancellation for Ride ${rideId}`);
    
    const bookings = await bookingRepository.findByRideId(rideId);
    
    for (const booking of bookings) {
      if (booking.status === BOOKING_STATUS.CANCELLED) continue;

      // Update status
      await bookingRepository.updateStatus(booking.id, BOOKING_STATUS.CANCELLED);
      
      // If payment was already successful (CONFIRMED), trigger refund
      if (booking.status === BOOKING_STATUS.CONFIRMED) {
        logger.info(`[Saga] Triggering refund for CONFIRMED booking ${booking.id}`);
        // In a real app, this would use RabbitMQ to queue a refund job
        // await publishJob(RABBITMQ_QUEUES.REFUND_QUEUE, { bookingId: booking.id, amount: booking.total_price });
      }

      await publishBookingEvent(KAFKA_TOPICS.BOOKING_CANCELLED, { ...booking, status: BOOKING_STATUS.CANCELLED, cancelReason: 'Ride was cancelled' });
    }
    
    logger.info(`[Saga] Ride cancellation handled for Ride ${rideId}. Affected bookings: ${bookings.length}`);
  }
}

export const bookingCompensation = new BookingCompensation();
