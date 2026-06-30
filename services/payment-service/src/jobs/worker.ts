import { rabbitMqChannel } from '../config/rabbitmq';
import { RABBITMQ_QUEUES, PAYMENT_STATUS } from '../utils/constants';
import { paymentRepository } from '../repositories/payment.repository';
import { paymentService } from '../services/payment.service';
import { logger } from '../config/logger';

export const startRabbitMqWorker = async () => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.PAYMENT_TIMEOUT, { durable: true });
    
    rabbitMqChannel.consume(RABBITMQ_QUEUES.PAYMENT_TIMEOUT, async (msg) => {
      if (!msg) return;

      const { paymentId } = JSON.parse(msg.content.toString());
      
      try {
        const payment = await paymentRepository.findById(paymentId);
        
        if (payment && payment.status === PAYMENT_STATUS.INTENT_CREATED) {
          logger.info(`Payment ${paymentId} timed out. Marking as failed.`);
          await paymentService.markAsFailed(paymentId, 'Payment timeout');
        }

        rabbitMqChannel.ack(msg);
      } catch (error) {
        logger.error(`Error processing payment timeout for ${paymentId}`, error);
        // Nack to retry later
        rabbitMqChannel.nack(msg, false, false); 
      }
    });

    logger.info('RabbitMQ worker started successfully');
  } catch (error) {
    logger.error('Error starting RabbitMQ worker', error);
  }
};
