import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

export const startBookingConsumer = async () => {
  await consumer.subscribe({ topic: 'booking.events', fromBeginning: false });

  logger.info('Started Booking Consumer');
};

export const handleBookingEvents = async (topic: string, partition: number, message: any) => {
  if (topic !== 'booking.events') return;

  try {
    const value = message.value?.toString();
    if (!value) return;

    const event = JSON.parse(value);
    logger.info(`Received Booking Event: ${event.type}`, { eventId: event.id });

    // Assuming event has a userId or driverId
    const targetUserId = event.userId || event.driverId;
    
    if (targetUserId) {
      emitToUser(targetUserId, 'notification:booking', event);
    }
  } catch (error) {
    logger.error('Error processing booking event', error);
  }
};
