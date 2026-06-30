import { kafkaProducer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const publishAutoshiftStartedEvent = async (data: { autoshiftId: string; rideId: string; reason: string; type: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.AUTOSHIFT_STARTED,
      messages: [{ value: JSON.stringify(data) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.AUTOSHIFT_STARTED}`, { autoshiftId: data.autoshiftId });
  } catch (error) {
    logger.error(`Failed to publish ${KAFKA_TOPICS.AUTOSHIFT_STARTED}`, error);
  }
};

export const publishDriverReplacedEvent = async (data: { autoshiftId: string; rideId: string; oldDriverId: string; newDriverId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.DRIVER_REPLACED,
      messages: [{ value: JSON.stringify(data) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.DRIVER_REPLACED}`, { rideId: data.rideId });
  } catch (error) {
    logger.error(`Failed to publish ${KAFKA_TOPICS.DRIVER_REPLACED}`, error);
  }
};

export const publishRideTransferredEvent = async (data: { autoshiftId: string; rideId: string; oldDriverId: string; newDriverId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.RIDE_TRANSFERRED,
      messages: [{ value: JSON.stringify(data) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.RIDE_TRANSFERRED}`, { rideId: data.rideId });
  } catch (error) {
    logger.error(`Failed to publish ${KAFKA_TOPICS.RIDE_TRANSFERRED}`, error);
  }
};

export const publishAutoshiftCompletedEvent = async (data: { autoshiftId: string; rideId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.AUTOSHIFT_COMPLETED,
      messages: [{ value: JSON.stringify(data) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.AUTOSHIFT_COMPLETED}`, { autoshiftId: data.autoshiftId });
  } catch (error) {
    logger.error(`Failed to publish ${KAFKA_TOPICS.AUTOSHIFT_COMPLETED}`, error);
  }
};

export const publishAutoshiftFailedEvent = async (data: { autoshiftId: string; rideId: string; reason: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.AUTOSHIFT_FAILED,
      messages: [{ value: JSON.stringify(data) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.AUTOSHIFT_FAILED}`, { autoshiftId: data.autoshiftId });
  } catch (error) {
    logger.error(`Failed to publish ${KAFKA_TOPICS.AUTOSHIFT_FAILED}`, error);
  }
};
