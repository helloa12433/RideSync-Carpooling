import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { emitToUser } from '../websocket/socket.gateway';

const NOTIFICATION_QUEUE = 'notification.queue';

export const startRabbitMqWorker = async () => {
  if (!rabbitMqChannel) {
    logger.error('RabbitMQ channel not initialized for worker');
    return;
  }

  try {
    await rabbitMqChannel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
    
    rabbitMqChannel.consume(NOTIFICATION_QUEUE, async (msg: any) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          
          console.log(`[RABBITMQ CONSUMER] Notification Service consumed job from queue ${NOTIFICATION_QUEUE}:`, content);
          logger.info(`Received Notification Job`, { targetUserId: content.userId || content.driverId });
          
          const targetUserId = content.userId || content.driverId;
          if (targetUserId) {
            emitToUser(targetUserId, 'notification:general', content);
          }
          
          rabbitMqChannel.ack(msg);
        } catch (error) {
          logger.error('Error processing notification job via RabbitMQ', error);
          // For now just ack it so it doesn't get stuck if malformed
          rabbitMqChannel.ack(msg);
        }
      }
    });
    
    logger.info(`Started RabbitMQ worker on queue ${NOTIFICATION_QUEUE}`);
  } catch (error) {
    logger.error(`Failed to start RabbitMQ worker on queue ${NOTIFICATION_QUEUE}`, error);
  }
};
