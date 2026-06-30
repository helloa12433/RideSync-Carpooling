import { rabbitMqChannel } from '../config/rabbitmq';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { logger } from '../config/logger';

export const scheduleAutoshiftRetry = async (rideId: string, driverId: string, reason: string) => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.AUTOSHIFT_RETRY, { durable: true });
    rabbitMqChannel.sendToQueue(
      RABBITMQ_QUEUES.AUTOSHIFT_RETRY,
      Buffer.from(JSON.stringify({ rideId, driverId, reason })),
      { persistent: true }
    );
    logger.info(`Scheduled autoshift retry for ride ${rideId}`);
  } catch (error) {
    logger.error('Failed to schedule autoshift retry', error);
  }
};
