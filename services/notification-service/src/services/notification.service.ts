import { emitToUser } from '../websocket/socket.gateway';
import { logger } from '../config/logger';

export const sendNotification = (userId: string, eventName: string, payload: any) => {
  logger.info(`Processing notification for user ${userId}`);
  emitToUser(userId, eventName, payload);
};
