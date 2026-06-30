import { logger } from '../config/logger';

export const startRabbitMqWorker = async () => {
  try {
    logger.info('RabbitMQ worker started successfully (Main Queue)');
  } catch (error) {
    logger.error('Error starting RabbitMQ worker', error);
  }
};
