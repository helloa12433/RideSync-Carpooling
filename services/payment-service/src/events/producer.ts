import { kafkaProducer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const publishPaymentSuccessEvent = async (eventData: { paymentId: string; bookingId: string; userId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.PAYMENT_SUCCESS,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.PAYMENT_SUCCESS}`, { paymentId: eventData.paymentId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.PAYMENT_SUCCESS}`, error);
    throw error;
  }
};

export const publishPaymentFailedEvent = async (eventData: { paymentId: string; bookingId: string; userId: string; reason: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.PAYMENT_FAILED,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.PAYMENT_FAILED}`, { paymentId: eventData.paymentId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.PAYMENT_FAILED}`, error);
    throw error;
  }
};

export const publishPaymentRefundedEvent = async (eventData: { paymentId: string; bookingId: string; userId: string; amount: number; reason: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.PAYMENT_REFUNDED,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.PAYMENT_REFUNDED}`, { paymentId: eventData.paymentId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.PAYMENT_REFUNDED}`, error);
    throw error;
  }
};

export const publishPaymentCancelledEvent = async (eventData: { paymentId: string; bookingId: string; userId: string }) => {
  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.PAYMENT_CANCELLED,
      messages: [{ value: JSON.stringify(eventData) }],
    });
    logger.info(`Event published to ${KAFKA_TOPICS.PAYMENT_CANCELLED}`, { paymentId: eventData.paymentId });
  } catch (error) {
    logger.error(`Failed to publish event to ${KAFKA_TOPICS.PAYMENT_CANCELLED}`, error);
    throw error;
  }
};
