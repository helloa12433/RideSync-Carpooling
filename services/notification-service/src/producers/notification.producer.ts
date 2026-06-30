import { kafka } from '../config/kafka';
import { logger } from '../config/logger';

const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    await producer.connect();
    logger.info('Connected to Kafka producer successfully');
  } catch (error) {
    logger.error('Failed to connect to Kafka producer', error);
  }
};

// Even though notification service mainly consumes, it might need to produce acknowledgment events
export const publishEvent = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    logger.info(`Published event to ${topic}`);
  } catch (error) {
    logger.error(`Failed to publish event to ${topic}`, error);
  }
};
