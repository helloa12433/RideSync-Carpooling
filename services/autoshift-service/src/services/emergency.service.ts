import { notificationClient } from '../clients/notification.client';
import { logger } from '../config/logger';

export class EmergencyService {
  /**
   * Sends emergency-level notifications to passenger and the platform.
   * Called for critical events like driver accident or ride emergency.
   */
  async notifyEmergency(rideId: string, passengerId: string, driverId: string, reason: string): Promise<void> {
    logger.warn(`EMERGENCY for ride ${rideId}: ${reason}`);

    await notificationClient.sendNotification(
      passengerId,
      `Emergency alert: ${reason}. A replacement driver is being arranged immediately.`
    );

    await notificationClient.sendNotification(
      driverId,
      `Emergency reported for ride ${rideId}. A replacement driver is being arranged.`
    );

    // In production, this would also alert platform ops / emergency services
    logger.info(`Emergency notifications sent for ride ${rideId}`);
  }
}

export const emergencyService = new EmergencyService();
