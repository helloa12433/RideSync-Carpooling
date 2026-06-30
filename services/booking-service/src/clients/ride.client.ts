import { IRideClient } from '../interfaces/ride-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class RideClient extends BaseHttpClient implements IRideClient {
  private readonly baseUrl = env.services.ride;

  async verifyRideAvailability(rideId: string, requestedSeats: number): Promise<boolean> {
    try {
      const result = await this.get<{ availableSeats: number }>(`${this.baseUrl}/api/v1/rides/${rideId}/availability`);
      return result.availableSeats >= requestedSeats;
    } catch (error) {
      logger.error(`Error verifying ride availability for ride ${rideId}`, error);
      return false;
    }
  }

  async reserveSeats(rideId: string, requestedSeats: number): Promise<boolean> {
    try {
      await this.post(`${this.baseUrl}/api/v1/rides/${rideId}/reserve`, { seats: requestedSeats });
      return true;
    } catch (error) {
      logger.error(`Error reserving seats for ride ${rideId}`, error);
      return false;
    }
  }

  async releaseSeats(rideId: string, seats: number): Promise<boolean> {
    try {
      await this.post(`${this.baseUrl}/api/v1/rides/${rideId}/release`, { seats });
      return true;
    } catch (error) {
      logger.error(`Error releasing seats for ride ${rideId}`, error);
      return false;
    }
  }
}

export const rideClient = new RideClient();
