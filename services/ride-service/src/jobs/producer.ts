import { rabbitmq } from '../config/rabbitmq';
import { logger } from '../config/logger';

export const publishJob = async (queue: string, message: any): Promise<void> => {
  try {
    if (!rabbitmq.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    await rabbitmq.channel.assertQueue(queue, { durable: true });
    
    rabbitmq.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    
    logger.info(`Successfully published job to queue: ${queue}`);
  } catch (error) {
    logger.error(`Failed to publish job to queue: ${queue}`, { error, queue });
    throw error;
  }
};
