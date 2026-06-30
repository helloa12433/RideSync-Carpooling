import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

export const startAutoShiftConsumer = async () => {
  await consumer.subscribe({ topic: 'autoshift.events', fromBeginning: false });
  logger.info('Started AutoShift Consumer');
};

export const handleAutoShiftEvents = async (topic: string, partition: number, message: any) => {
  if (topic !== 'autoshift.events') return;

  try {
    const value = message.value?.toString();
    if (!value) return;

    const event = JSON.parse(value);
    logger.info(`Received AutoShift Event: ${event.type}`, { eventId: event.id });

    // AutoShift might notify both the passenger and the new driver
    if (event.userId) {
      emitToUser(event.userId, 'notification:autoshift', event);
    }
    if (event.driverId) {
      emitToUser(event.driverId, 'notification:autoshift', event);
    }
  } catch (error) {
    logger.error('Error processing autoshift event', error);
  }
};
