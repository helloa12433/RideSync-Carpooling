import { Request, Response } from 'express';
import { paymentIntentService } from '../services/payment-intent.service';
import { paymentService } from '../services/payment.service';
import { refundService } from '../services/refund.service';
import { webhookService } from '../services/webhook.service';
import { paymentStatusService } from '../services/payment-status.service';
import { paymentRepository } from '../repositories/payment.repository';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';
import { mapPaymentToDto } from '../utils/mapper';

export class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { bookingId, userId, amount, currency } = req.body;
      const payment = await paymentIntentService.createIntent({ bookingId, userId, amount, currency });

      return sendResponse(res, HTTP_STATUS.CREATED, true, 'Payment intent created', mapPaymentToDto(payment));
    } catch (error: any) {
      logger.error('Error in createPaymentIntent controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to create payment intent');
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentId, transactionId } = req.body;
      await paymentService.confirmPayment({ paymentId, transactionId });

      return sendResponse(res, HTTP_STATUS.OK, true, 'Payment confirmed successfully');
    } catch (error: any) {
      logger.error('Error in confirmPayment controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to confirm payment');
    }
  }

  async cancelPayment(req: Request, res: Response) {
    try {
      const { paymentId, reason } = req.body;
      await paymentService.cancelPayment({ paymentId, reason });

      return sendResponse(res, HTTP_STATUS.OK, true, 'Payment cancelled successfully');
    } catch (error: any) {
      logger.error('Error in cancelPayment controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to cancel payment');
    }
  }

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId, reason } = req.body;
      await refundService.processRefund(paymentId, reason);

      return sendResponse(res, HTTP_STATUS.OK, true, 'Refund processed successfully');
    } catch (error: any) {
      logger.error('Error in refundPayment controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to process refund');
    }
  }

  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const status = await paymentStatusService.getPaymentStatus(paymentId);

      if (!status) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, 'Payment not found');
      }

      return sendResponse(res, HTTP_STATUS.OK, true, 'Payment status retrieved', status);
    } catch (error: any) {
      logger.error('Error in getPaymentStatus controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to get payment status');
    }
  }

  async getPaymentByBookingId(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const payment = await paymentRepository.findByBookingId(bookingId);

      if (!payment) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, 'Payment not found for this booking');
      }

      return sendResponse(res, HTTP_STATUS.OK, true, 'Payment retrieved', mapPaymentToDto(payment));
    } catch (error: any) {
      logger.error('Error in getPaymentByBookingId controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to get payment');
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      await webhookService.handleWebhook(req.body);
      return sendResponse(res, HTTP_STATUS.OK, true, 'Webhook processed');
    } catch (error: any) {
      logger.error('Error in handleWebhook controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to process webhook');
    }
  }
}

export const paymentController = new PaymentController();
