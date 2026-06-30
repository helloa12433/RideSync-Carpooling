import { WebhookDto } from '../dto/webhook.dto';
import { paymentService } from './payment.service';
import { logger } from '../config/logger';

export class WebhookService {
  async handleWebhook(payload: WebhookDto): Promise<void> {
    logger.info(`Received webhook event: ${payload.eventType}`);

    const paymentId = payload.data.object.metadata.paymentId;

    if (!paymentId) {
      logger.warn('Webhook payload missing paymentId in metadata');
      return;
    }

    switch (payload.eventType) {
      case 'payment_intent.succeeded':
        await paymentService.confirmPayment({
          paymentId,
          transactionId: payload.data.object.id,
        });
        break;
        
      case 'payment_intent.payment_failed':
        await paymentService.markAsFailed(paymentId, 'Gateway reported failure');
        break;

      case 'payment_intent.canceled':
        await paymentService.cancelPayment({
          paymentId,
          reason: 'Gateway reported cancellation',
        });
        break;

      default:
        logger.info(`Unhandled webhook event type: ${payload.eventType}`);
    }
  }
}

export const webhookService = new WebhookService();
