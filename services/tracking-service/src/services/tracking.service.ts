import { locationService } from './location.service';
import { etaService } from './eta.service';
import { tripHistoryService } from './trip-history.service';
import { socketManager } from '../websocket/socket-manager';
import { TrackingResponseDto } from '../dto/tracking-response.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { logger } from '../config/logger';
import { TRIP_STATUS } from '../utils/constants';

export class TrackingService {
  async updateDriverLocation(data: UpdateLocationDto): Promise<void> {
    await locationService.updateDriverLocation(data);
    
    // In a real scenario, we'd fetch the destination from rideClient to calculate live ETA
    // Let's mock a target location
    const targetLat = 40.7128;
    const targetLon = -74.0060;

    const { etaMinutes, distanceKm } = etaService.calculateEta(data.lat, data.lon, targetLat, targetLon);
    
    socketManager.broadcastLocation(data.rideId, {
      driverId: data.driverId,
      lat: data.lat,
      lon: data.lon,
      etaMinutes,
      distanceKm
    });
  }

  async getTrackingState(rideId: string, driverId: string, passengerId: string): Promise<TrackingResponseDto> {
    const driverLoc = await locationService.getDriverLocation(driverId);
    const passengerLoc = await locationService.getPassengerLocation(passengerId);

    const state: TrackingResponseDto = {
      rideId,
      driverId,
      status: 'TRACKING_ACTIVE',
    };

    if (driverLoc) state.driverLocation = { lat: driverLoc.lat, lon: driverLoc.lon };
    if (passengerLoc) state.passengerLocation = { lat: passengerLoc.lat, lon: passengerLoc.lon };

    return state;
  }

  async handleRideStarted(rideId: string) {
    await tripHistoryService.startTripHistory(rideId);
    socketManager.broadcastTripStatus(rideId, { status: TRIP_STATUS.STARTED });
  }

  async handleRideCompleted(rideId: string) {
    await tripHistoryService.completeTripHistory(rideId, TRIP_STATUS.COMPLETED);
    socketManager.broadcastTripStatus(rideId, { status: TRIP_STATUS.COMPLETED });
  }

  async handleRideCancelled(rideId: string) {
    await tripHistoryService.completeTripHistory(rideId, TRIP_STATUS.CANCELLED);
    socketManager.broadcastTripStatus(rideId, { status: TRIP_STATUS.CANCELLED });
  }
}

export const trackingService = new TrackingService();
