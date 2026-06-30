import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

export const startTrackingConsumer = async () => {
  await consumer.subscribe({ topic: 'tracking.events', fromBeginning: false });
  logger.info('Started Tracking Consumer');
};

export const handleTrackingEvents = async (topic: string, partition: number, message: any) => {
  if (topic !== 'tracking.events') return;

  try {
    const value = message.value?.toString();
    if (!value) return;

    const event = JSON.parse(value);
    logger.info(`Received Tracking Event: ${event.type}`, { eventId: event.id });

    const targetUserId = event.userId || event.driverId;
    if (targetUserId) {
      emitToUser(targetUserId, 'notification:tracking', event);
    }
  } catch (error) {
    logger.error('Error processing tracking event', error);
  }
};
