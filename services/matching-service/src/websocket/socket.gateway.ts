import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../config/logger';

let io: SocketServer;

export const initWebSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    path: '/api/v1/matchings/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected to matching-service WS: ${socket.id}`);

    // Allow user to subscribe to a specific search query to get live updates
    socket.on('subscribe_search', (data: { source: string, destination: string, date: string }) => {
      const room = `search_${data.source}_${data.destination}_${data.date}`.toLowerCase().replace(/\s+/g, '_');
      socket.join(room);
      logger.info(`Client ${socket.id} subscribed to ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected from matching-service WS: ${socket.id}`);
    });
  });
};

export const broadcastNewRide = (ride: any) => {
  if (!io) return;
  const source = ride.source_location || '';
  const dest = ride.destination_location || '';
  const date = new Date(ride.departure_time).toISOString().split('T')[0];
  
  // Try to emit to potential rooms (simplified logic for exact match)
  const room = `search_${source}_${dest}_${date}`.toLowerCase().replace(/\s+/g, '_');
  io.to(room).emit('new_ride', ride);
  
  // Also emit globally just in case the frontend is not using precise rooms
  io.emit('new_ride', ride);
};
