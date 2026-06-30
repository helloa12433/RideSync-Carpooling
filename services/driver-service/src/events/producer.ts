import { producer } from '../config/kafka';
import { logger } from '../config/logger';

export const publishEvent = async (topic: string, eventData: unknown): Promise<void> => {
  try {
    if (topic === 'driver.updated' || topic === 'driver.created') {
      console.log('[DriverService] Kafka Producer → Publishing event');
      console.log(`[Kafka] Topic: ${topic}`);
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(eventData) }],
    });

    if (topic === 'driver.updated' || topic === 'driver.created') {
      console.log('[Kafka Broker] ACK Received');
      console.log('[DriverService] Event published successfully');
    }

    logger.info(`[Kafka] Event published to topic: ${topic}`, { eventData });
  } catch (error) {
    logger.error(`[Kafka] Failed to publish event to topic: ${topic}`, { error });
  }
};
