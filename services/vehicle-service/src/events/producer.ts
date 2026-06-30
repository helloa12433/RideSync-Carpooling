import { producer } from '../config/kafka';
import { logger } from '../config/logger';

export const publishEvent = async (topic: string, message: any): Promise<void> => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    logger.info(`Successfully published event to topic: ${topic}`, { topic });
  } catch (error) {
    logger.error(`Failed to publish event to topic: ${topic}`, { error, topic });
    throw error;
  }
};
