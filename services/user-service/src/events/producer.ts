import { producer } from '../config/kafka';
import { logger } from '../config/logger';

export const publishEvent = async (topic: string, eventData: unknown): Promise<void> => {
  try {
    if (topic === 'user.updated') {
      console.log('Kafka Producer Publish');
      console.log('↓');
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(eventData) }],
    });

    if (topic === 'user.updated') {
      console.log('Kafka Broker ACK');
      console.log('↓');
      console.log('Event Published Successfully');
    }

    logger.info(`Event published to topic ${topic}`, { eventData });
  } catch (error) {
    logger.error(`Failed to publish event to topic ${topic}`, { error });
  }
};
