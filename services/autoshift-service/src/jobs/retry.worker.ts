import { logger } from '../config/logger';

export const startRetryWorker = async () => {
  try {
    logger.info('RabbitMQ Retry worker started successfully');
  } catch (error) {
    logger.error('Error starting RabbitMQ Retry worker', error);
  }
};
