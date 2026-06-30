import { io } from './socket';
import { SOCKET_EVENTS } from './socket-events';
import { logger } from '../config/logger';

export class SocketManager {
  broadcastLocation(rideId: string, locationData: any) {
    if (!io) {
      logger.warn('Socket.io not initialized');
      return;
    }
    io.to(`ride:${rideId}`).emit(SOCKET_EVENTS.LOCATION_UPDATE, locationData);
  }

  broadcastTripStatus(rideId: string, statusData: any) {
    if (!io) {
      logger.warn('Socket.io not initialized');
      return;
    }
    io.to(`ride:${rideId}`).emit(SOCKET_EVENTS.TRIP_STATUS_UPDATE, statusData);
  }
}

export const socketManager = new SocketManager();
