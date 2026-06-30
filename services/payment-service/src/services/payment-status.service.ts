import { paymentRepository } from '../repositories/payment.repository';
import { PAYMENT_STATUS } from '../utils/constants';
import { redisClient } from '../config/redis';
import { REDIS_KEYS } from '../utils/constants';

export class PaymentStatusService {
  async getPaymentStatus(paymentId: string) {
    // Check Redis cache first
    const cachedStatus = await redisClient.get(`${REDIS_KEYS.PAYMENT_STATUS}${paymentId}`);
    if (cachedStatus) {
      return JSON.parse(cachedStatus);
    }

    // Fallback to Cassandra DB
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) return null;

    const statusObj = { status: payment.status, bookingId: payment.booking_id };
    
    // Cache in Redis for fast access (1 hour TTL)
    await redisClient.set(`${REDIS_KEYS.PAYMENT_STATUS}${paymentId}`, JSON.stringify(statusObj), { EX: 3600 });
    
    return statusObj;
  }

  async updatePaymentStatus(paymentId: string, status: string, details: string = ''): Promise<void> {
    await paymentRepository.updateStatus(paymentId, status);
    await paymentRepository.insertTransactionHistory(paymentId, status, details);
    
    // Update cache
    const payment = await paymentRepository.findById(paymentId);
    if (payment) {
      const statusObj = { status: payment.status, bookingId: payment.booking_id };
      await redisClient.set(`${REDIS_KEYS.PAYMENT_STATUS}${paymentId}`, JSON.stringify(statusObj), { EX: 3600 });
    }
  }
}

export const paymentStatusService = new PaymentStatusService();
