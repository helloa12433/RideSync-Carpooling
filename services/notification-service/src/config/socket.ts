import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './env';
import { initSocketGateway } from '../websocket/socket.gateway';
import { logger } from './logger';

export const setupSocket = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  initSocketGateway(io);

  logger.info('Socket.IO initialized');
  return io;
};
