import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

export const startPaymentConsumer = async () => {
  await consumer.subscribe({ topic: 'payment.events', fromBeginning: false });
  logger.info('Started Payment Consumer');
};

export const handlePaymentEvents = async (topic: string, partition: number, message: any) => {
  if (topic !== 'payment.events') return;

  try {
    const value = message.value?.toString();
    if (!value) return;

    const event = JSON.parse(value);
    logger.info(`Received Payment Event: ${event.type}`, { eventId: event.id });

    const targetUserId = event.userId || event.driverId;
    if (targetUserId) {
      emitToUser(targetUserId, 'notification:payment', event);
    }
  } catch (error) {
    logger.error('Error processing payment event', error);
  }
};
