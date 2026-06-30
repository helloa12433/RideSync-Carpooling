import { IRideClient } from '../interfaces/ride-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class RideClient extends BaseHttpClient implements IRideClient {
  private readonly baseUrl = env.services.ride;

  async getRideDetails(rideId: string): Promise<any> {
    try {
      const result = await this.get<any>(`${this.baseUrl}/api/v1/rides/${rideId}`);
      return result.data;
    } catch (error) {
      logger.error(`Error fetching ride details for ride ${rideId}`, error);
      return null;
    }
  }

  async updateRideDriver(rideId: string, newDriverId: string): Promise<any> {
    try {
      const result = await this.put<any>(`${this.baseUrl}/api/v1/rides/${rideId}/driver`, { driverId: newDriverId });
      return result.data;
    } catch (error) {
      logger.error(`Error updating ride driver for ride ${rideId}`, error);
      throw error;
    }
  }
}

export const rideClient = new RideClient();
