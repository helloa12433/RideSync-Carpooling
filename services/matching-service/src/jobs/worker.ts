import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { RABBITMQ_QUEUES } from '../utils/constants';

export const startRabbitMqWorker = async () => {
  try {
    // Currently, our main matching happens via Kafka 'ride-created' events.
    // If we wanted to process matching requests from RabbitMQ directly, we'd do it here.
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.MATCHING_REQUEST, { durable: true });
    logger.info('RabbitMQ worker started successfully (Main Queue)');
  } catch (error) {
    logger.error('Error starting RabbitMQ worker', error);
  }
};
