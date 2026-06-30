import { ITrackingClient } from '../interfaces/tracking-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class TrackingClient extends BaseHttpClient implements ITrackingClient {
  private readonly baseUrl = env.services.tracking;

  async getPassengerLocation(rideId: string, passengerId: string): Promise<any> {
    try {
      const result = await this.get<any>(
        `${this.baseUrl}/api/v1/tracking/${rideId}/state?driverId=none&passengerId=${passengerId}`
      );
      return result.data?.passengerLocation || null;
    } catch (error) {
      logger.error(`Error fetching passenger location for ride ${rideId}`, error);
      return null;
    }
  }

  async getDriverLocation(rideId: string, driverId: string): Promise<any> {
    try {
      const result = await this.get<any>(
        `${this.baseUrl}/api/v1/tracking/${rideId}/state?driverId=${driverId}&passengerId=none`
      );
      return result.data?.driverLocation || null;
    } catch (error) {
      logger.error(`Error fetching driver location for ride ${rideId}`, error);
      return null;
    }
  }

  async updateTrackingDriver(rideId: string, newDriverId: string): Promise<any> {
    try {
      const result = await this.put<any>(`${this.baseUrl}/api/v1/tracking/${rideId}/driver`, {
        driverId: newDriverId,
      });
      return result.data;
    } catch (error) {
      logger.error(`Error updating tracking driver for ride ${rideId}`, error);
      throw error;
    }
  }
}

export const trackingClient = new TrackingClient();
