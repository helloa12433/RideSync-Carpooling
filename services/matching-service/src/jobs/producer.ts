import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { CreateMatchingDto } from '../dto/create-matching.dto';

export const scheduleMatchingRetry = async (data: CreateMatchingDto) => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.MATCHING_RETRY, { durable: true });
    
    const message = Buffer.from(JSON.stringify(data));
    
    // Retry after 10 seconds
    rabbitMqChannel.sendToQueue(RABBITMQ_QUEUES.MATCHING_RETRY, message, {
      persistent: true,
      expiration: 10000, 
    });
    
    logger.info(`Scheduled matching retry for ride ${data.rideId}`);
  } catch (error) {
    logger.error(`Failed to schedule matching retry for ride ${data.rideId}`, error);
  }
};
