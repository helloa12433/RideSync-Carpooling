import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { RABBITMQ_QUEUES, BOOKING_STATUS } from '../utils/constants';
import { bookingRepository } from '../repositories/booking.repository';

export const startRabbitMqWorker = async () => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.BOOKING_EXPIRY, { durable: true });
    
    rabbitMqChannel.consume(RABBITMQ_QUEUES.BOOKING_EXPIRY, async (msg) => {
      if (msg) {
        const content = msg.content.toString();
        const { bookingId } = JSON.parse(content);
        
        logger.info(`Processing booking expiry for ${bookingId}`);
        
        const booking = await bookingRepository.findById(bookingId);
        
        if (booking && booking.status === BOOKING_STATUS.PENDING) {
          logger.info(`Expiring booking ${bookingId}`);
          await bookingRepository.updateStatus(bookingId, BOOKING_STATUS.CANCELLED);
          // TODO: Release seats via rideClient
        }

        rabbitMqChannel.ack(msg);
      }
    });
    logger.info('RabbitMQ worker started successfully');
  } catch (error) {
    logger.error('Error starting RabbitMQ worker', error);
  }
};
