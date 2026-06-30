import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { RABBITMQ_QUEUES } from '../utils/constants';

export const scheduleBookingExpiry = async (bookingId: string) => {
  try {
    await rabbitMqChannel.assertQueue(RABBITMQ_QUEUES.BOOKING_EXPIRY, { durable: true });
    
    // Send to a delayed exchange or just a queue for worker to handle
    const message = Buffer.from(JSON.stringify({ bookingId }));
    
    rabbitMqChannel.sendToQueue(RABBITMQ_QUEUES.BOOKING_EXPIRY, message, {
      persistent: true,
      expiration: 15 * 60 * 1000, // 15 mins expiry
    });
    
    logger.info(`Scheduled booking expiry for ${bookingId}`);
  } catch (error) {
    logger.error(`Failed to schedule booking expiry for ${bookingId}`, error);
  }
};
