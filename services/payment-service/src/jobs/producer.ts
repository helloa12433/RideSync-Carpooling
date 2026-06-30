import { rabbitMqChannel } from '../config/rabbitmq';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { logger } from '../config/logger';

export const schedulePaymentTimeout = async (paymentId: string) => {
  try {
    // Check payment status in 10 minutes (simulated with 10 sec for dev)
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.PAYMENT_TIMEOUT, { durable: true });
    rabbitMqChannel.sendToQueue(
      RABBITMQ_QUEUES.PAYMENT_TIMEOUT,
      Buffer.from(JSON.stringify({ paymentId })),
      { persistent: true }
    );
    logger.info(`Scheduled timeout check for payment ${paymentId}`);
  } catch (error) {
    logger.error('Failed to schedule payment timeout', error);
  }
};
