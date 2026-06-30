import { kafkaProducer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const publishDriverAssignedEvent = async (eventData: { rideId: string; driverId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.DRIVER_ASSIGNED,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.DRIVER_ASSIGNED}`, { rideId: eventData.rideId, driverId: eventData.driverId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.DRIVER_ASSIGNED}`, error);
    throw error;
  }
};
