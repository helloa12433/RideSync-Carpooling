import { IPaymentClient } from '../interfaces/payment-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class PaymentClient extends BaseHttpClient implements IPaymentClient {
  private readonly baseUrl = env.services.payment;

  async processPayment(userId: string, amount: number, bookingId: string): Promise<boolean> {
    try {
      const response = await this.post<{ success: boolean }>(`${this.baseUrl}/api/v1/payments/process`, {
        userId,
        amount,
        bookingId,
      });
      return response.success;
    } catch (error) {
      logger.error(`Error processing payment for booking ${bookingId}`, error);
      return false;
    }
  }

  async refundPayment(userId: string, amount: number, bookingId: string): Promise<boolean> {
    try {
      const response = await this.post<{ success: boolean }>(`${this.baseUrl}/api/v1/payments/refund`, {
        userId,
        amount,
        bookingId,
      });
      return response.success;
    } catch (error) {
      logger.error(`Error refunding payment for booking ${bookingId}`, error);
      return false;
    }
  }
}

export const paymentClient = new PaymentClient();
