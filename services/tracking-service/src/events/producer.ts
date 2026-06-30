import { kafkaProducer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const publishDriverLocationEvent = async (eventData: { driverId: string; lat: number; lon: number }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.DRIVER_LOCATION_UPDATE,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    // Too verbose to log every location update in production, keep to debug
    logger.debug(`Event published to ${KAFKA_TOPICS.DRIVER_LOCATION_UPDATE}`, { driverId: eventData.driverId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.DRIVER_LOCATION_UPDATE}`, error);
    throw error;
  }
};
