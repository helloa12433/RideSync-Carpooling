import { INotificationClient } from '../interfaces/notification-client.interface';
import { BaseHttpClient } from './base-http.client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class NotificationClient extends BaseHttpClient implements INotificationClient {
  private readonly baseUrl = env.services.notification;

  async sendNotification(userId: string, message: string): Promise<boolean> {
    try {
      await this.post(`${this.baseUrl}/api/v1/notifications/send`, { userId, message });
      return true;
    } catch (error) {
      logger.error(`Error sending notification to user ${userId}`, error);
      return false;
    }
  }
}

export const notificationClient = new NotificationClient();
