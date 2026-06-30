import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { requestContext } from '@carpool/shared-utils';

export const publishWelcomeEmailJob = async (userPayload: any) => {
  const store = requestContext.getStore();
  const requestId = store?.requestId || 'system';
  
  const queue = 'send-welcome-email';
  try {
    await rabbitMqChannel.assertQueue(queue, { durable: true });
    logger.info('Queue "send-welcome-email" exists');
    logger.info('Durable Queue Enabled');
  } catch (error: any) {
    logger.error('Queue Not Found', { error: error.message, stack: error.stack });
    return;
  }
  
  const message = {
    ...userPayload,
    requestId
  };
  
  logger.info('Publishing Message');
  logger.info('Publishing Job To RabbitMQ');
  const success = rabbitMqChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  if (success) {
    logger.info('Broker Acknowledged');
    logger.info('RabbitMQ Broker ACK');
    logger.info('Publish Success');
    logger.info('Message actually enters queue');
    logger.info('Message Added To Queue');
  } else {
    logger.error('Publish Failed');
  }
};
