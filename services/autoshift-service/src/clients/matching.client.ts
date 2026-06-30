import { IMatchingClient } from '../interfaces/matching-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class MatchingClient extends BaseHttpClient implements IMatchingClient {
  private readonly baseUrl = env.services.matching;

  async requestNewDriver(rideId: string, pickupLat: number, pickupLon: number, excludeDriverId: string): Promise<any> {
    try {
      const result = await this.post<any>(`${this.baseUrl}/api/v1/matching/autoshift`, {
        rideId,
        pickupLat,
        pickupLon,
        excludeDriverId,
      });
      return result.data;
    } catch (error) {
      logger.error(`Error requesting new driver from Matching Service for ride ${rideId}`, error);
      throw error;
    }
  }
}

export const matchingClient = new MatchingClient();
