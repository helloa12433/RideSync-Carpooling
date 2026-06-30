import { paymentRepository } from '../repositories/payment.repository';
import { paymentStatusService } from './payment-status.service';
import { publishPaymentSuccessEvent, publishPaymentFailedEvent, publishPaymentCancelledEvent } from '../events/producer';
import { PAYMENT_STATUS } from '../utils/constants';
import { logger } from '../config/logger';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { CancelPaymentDto } from '../dto/cancel-payment.dto';

export class PaymentService {
  async confirmPayment(data: ConfirmPaymentDto): Promise<void> {
    const payment = await paymentRepository.findById(data.paymentId);
    if (!payment) throw new Error('Payment not found');

    // Assume verification with payment gateway using transactionId
    await paymentStatusService.updatePaymentStatus(
      payment.id, 
      PAYMENT_STATUS.SUCCESS, 
      `Payment confirmed. Gateway TxID: ${data.transactionId || 'N/A'}`
    );

    await publishPaymentSuccessEvent({
      paymentId: payment.id,
      bookingId: payment.booking_id,
      userId: payment.user_id,
    });

    logger.info(`Payment ${payment.id} confirmed successfully`);
  }

  async cancelPayment(data: CancelPaymentDto): Promise<void> {
    const payment = await paymentRepository.findById(data.paymentId);
    if (!payment) return;

    if (payment.status === PAYMENT_STATUS.SUCCESS || payment.status === PAYMENT_STATUS.REFUNDED) {
      logger.warn(`Cannot cancel payment ${payment.id} with status ${payment.status}`);
      return;
    }

    await paymentStatusService.updatePaymentStatus(
      payment.id, 
      PAYMENT_STATUS.CANCELLED, 
      `Payment cancelled: ${data.reason || 'User requested cancel'}`
    );

    await publishPaymentCancelledEvent({
      paymentId: payment.id,
      bookingId: payment.booking_id,
      userId: payment.user_id,
    });

    logger.info(`Payment ${payment.id} cancelled`);
  }

  async markAsFailed(paymentId: string, reason: string): Promise<void> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) return;

    await paymentStatusService.updatePaymentStatus(paymentId, PAYMENT_STATUS.FAILED, `Payment failed: ${reason}`);

    await publishPaymentFailedEvent({
      paymentId: payment.id,
      bookingId: payment.booking_id,
      userId: payment.user_id,
      reason,
    });

    logger.info(`Payment ${payment.id} marked as failed`);
  }
}

export const paymentService = new PaymentService();
