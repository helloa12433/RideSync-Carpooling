import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { matchingService } from '../services/matching.service';

export const startRetryWorker = async () => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.MATCHING_RETRY, { durable: true });
    
    rabbitMqChannel.consume(RABBITMQ_QUEUES.MATCHING_RETRY, async (msg) => {
      if (msg) {
        const content = msg.content.toString();
        const data = JSON.parse(content);
        
        logger.info(`Retrying matching for ride ${data.rideId}`);
        await matchingService.processMatching(data);

        rabbitMqChannel.ack(msg);
      }
    });
    logger.info('RabbitMQ Retry worker started successfully');
  } catch (error) {
    logger.error('Error starting RabbitMQ Retry worker', error);
  }
};
