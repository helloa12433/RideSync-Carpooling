import { IDriverClient } from '../interfaces/notification-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class DriverClient extends BaseHttpClient implements IDriverClient {
  private readonly baseUrl = env.services.driver;

  async getDriverDetails(driverId: string): Promise<any> {
    try {
      const result = await this.get<any>(`${this.baseUrl}/api/v1/drivers/${driverId}`);
      return result.data;
    } catch (error) {
      logger.error(`Error fetching driver details for driver ${driverId}`, error);
      return null;
    }
  }

  async updateDriverStatus(driverId: string, status: string): Promise<boolean> {
    try {
      await this.put(`${this.baseUrl}/api/v1/drivers/${driverId}/status`, { status });
      return true;
    } catch (error) {
      logger.error(`Error updating driver status for driver ${driverId}`, error);
      return false;
    }
  }
}

export const driverClient = new DriverClient();
