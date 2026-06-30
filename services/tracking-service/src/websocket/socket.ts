import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../config/logger';
import { SOCKET_EVENTS } from './socket-events';
import { env } from '../config/env';

export let io: Server;

export const initializeWebSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    // In a real app, verify the token here
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // Set user info on socket
    (socket as any).userId = 'extracted_user_id';
    next();
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.SUBSCRIBE_RIDE, (rideId: string) => {
      logger.info(`Client ${socket.id} subscribed to ride ${rideId}`);
      socket.join(`ride:${rideId}`);
    });

    socket.on(SOCKET_EVENTS.UNSUBSCRIBE_RIDE, (rideId: string) => {
      logger.info(`Client ${socket.id} unsubscribed from ride ${rideId}`);
      socket.leave(`ride:${rideId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};
