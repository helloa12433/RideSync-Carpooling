import { kafkaProducer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const publishBookingEvent = async (topic: string, eventData: any) => {
  try {
    await kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${topic}`, { bookingId: eventData.id });
  } catch (error) {
    logger.error(`Failed to publish event to ${topic}`, error);
    throw error;
  }
};
