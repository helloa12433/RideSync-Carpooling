import { paymentRepository } from '../repositories/payment.repository';
import { paymentStatusService } from './payment-status.service';
import { publishPaymentRefundedEvent } from '../events/producer';
import { PAYMENT_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class RefundService {
  async processRefund(paymentId: string, reason: string = 'User requested refund'): Promise<void> {
    const payment = await paymentRepository.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PAYMENT_STATUS.SUCCESS) {
      throw new Error(`Cannot refund payment in state: ${payment.status}`);
    }

    // In a real system, call Stripe/Braintree refund API here
    logger.info(`Calling Payment Gateway to refund payment ${paymentId}`);

    await paymentStatusService.updatePaymentStatus(paymentId, PAYMENT_STATUS.REFUNDED, `Refund processed: ${reason}`);

    await publishPaymentRefundedEvent({
      paymentId: payment.id,
      bookingId: payment.booking_id,
      userId: payment.user_id,
      amount: payment.amount,
      reason,
    });

    logger.info(`Payment ${paymentId} refunded successfully`);
  }
}

export const refundService = new RefundService();
