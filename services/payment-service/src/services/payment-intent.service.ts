import { paymentRepository } from '../repositories/payment.repository';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { PAYMENT_STATUS } from '../utils/constants';
import { IPayment } from '../interfaces/payment.interface';
import { paymentStatusService } from './payment-status.service';
import { schedulePaymentTimeout } from '../jobs/producer';
import { logger } from '../config/logger';
import { redisClient } from '../config/redis';
import { REDIS_KEYS } from '../utils/constants';

export class PaymentIntentService {
  async createIntent(data: CreatePaymentIntentDto): Promise<IPayment> {
    const payment = await paymentRepository.create({
      bookingId: data.bookingId,
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      status: PAYMENT_STATUS.INTENT_CREATED,
    });

    await paymentRepository.insertTransactionHistory(
      payment.id, 
      PAYMENT_STATUS.INTENT_CREATED, 
      'Payment intent created successfully'
    );

    // Schedule a timeout job if payment is not confirmed in 10 minutes
    await schedulePaymentTimeout(payment.id);

    // Initial cache populate
    const statusObj = { status: payment.status, bookingId: payment.booking_id };
    await redisClient.set(`${REDIS_KEYS.PAYMENT_STATUS}${payment.id}`, JSON.stringify(statusObj), { EX: 3600 });

    logger.info(`Payment intent ${payment.id} created for booking ${data.bookingId}`);

    return payment;
  }
}

export const paymentIntentService = new PaymentIntentService();
