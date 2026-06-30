import { rabbitMqChannel } from '../config/rabbitmq';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { autoshiftService } from '../services/autoshift.service';
import { logger } from '../config/logger';

export const startRabbitMqWorker = async () => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.AUTOSHIFT_RETRY, { durable: true });

    rabbitMqChannel.consume(RABBITMQ_QUEUES.AUTOSHIFT_RETRY, async (msg) => {
      if (!msg) return;

      const { rideId, driverId, reason } = JSON.parse(msg.content.toString());

      try {
        logger.info(`Processing autoshift retry for ride ${rideId}`);
        await autoshiftService.handleEvent(rideId, driverId, reason);
        rabbitMqChannel.ack(msg);
      } catch (error) {
        logger.error(`Error processing autoshift retry for ride ${rideId}`, error);
        rabbitMqChannel.nack(msg, false, false);
      }
    });

    logger.info('RabbitMQ worker started successfully');
  } catch (error) {
    logger.error('Error starting RabbitMQ worker', error);
  }
};
