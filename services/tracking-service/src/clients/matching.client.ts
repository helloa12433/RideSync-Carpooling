import { IMatchingClient } from '../interfaces/ride-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class MatchingClient extends BaseHttpClient implements IMatchingClient {
  private readonly baseUrl = env.services.matching;

  async getMatchingDetails(matchingId: string): Promise<any> {
    try {
      const result = await this.get<any>(`${this.baseUrl}/api/v1/matchings/${matchingId}`);
      return result.data;
    } catch (error) {
      logger.error(`Error fetching matching details for matching ${matchingId}`, error);
      return null;
    }
  }
}

export const matchingClient = new MatchingClient();
