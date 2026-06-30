import { bookingRepository } from '../repositories/booking.repository';
import { logger } from '../config/logger';
import { publishBookingEvent } from '../events/producer';
import { KAFKA_TOPICS, BOOKING_STATUS } from '../utils/constants';
import { bookingCompensation } from './booking.compensation';
import { PaymentSuccessEvent, PaymentFailedEvent, RideCancelledEvent } from './saga.types';

export class BookingSaga {
  public async handlePaymentSuccess(event: PaymentSuccessEvent): Promise<void> {
    logger.info(`[Saga] Handling Payment Success for Booking ${event.bookingId}`);
    
    const booking = await bookingRepository.findById(event.bookingId);
    if (!booking) {
      logger.error(`[Saga] Booking ${event.bookingId} not found`);
      return;
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      logger.warn(`[Saga] Booking ${event.bookingId} is already in status ${booking.status}`);
      return;
    }

    // 1. Confirm booking
    await bookingRepository.updateStatus(event.bookingId, BOOKING_STATUS.CONFIRMED);
    
    // 2. Publish Booking Confirmed Event
    await publishBookingEvent('booking-confirmed', { ...booking, status: BOOKING_STATUS.CONFIRMED, transactionId: event.transactionId });
    
    logger.info(`[Saga] Booking ${event.bookingId} CONFIRMED successfully`);
  }

  public async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    logger.warn(`[Saga] Handling Payment Failed for Booking ${event.bookingId}`);
    await bookingCompensation.compensatePaymentFailure(event.bookingId, event.reason);
  }

  public async handleRideCancelled(event: RideCancelledEvent): Promise<void> {
    logger.warn(`[Saga] Handling Ride Cancelled for Ride ${event.rideId}`);
    await bookingCompensation.handleRideCancellation(event.rideId, event.reason);
  }
}

export const bookingSaga = new BookingSaga();
