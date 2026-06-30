import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger';

let io: SocketIOServer;

export const initSocketGateway = (socketIo: SocketIOServer) => {
  io = socketIo;

  io.on('connection', (socket: Socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Expect the client to send a register event with their userId
    socket.on('register', (userId: string) => {
      if (userId) {
        socket.join(userId);
        logger.info(`Socket ${socket.id} joined room (userId): ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emits an event to a specific user (or driver)
 */
export const emitToUser = (userId: string, eventName: string, payload: any) => {
  if (!io) {
    logger.warn('SocketGateway: io is not initialized yet.');
    return;
  }
  
  io.to(userId).emit(eventName, payload);
  logger.info(`Emitted '${eventName}' to user ${userId}`, { payload });
};
