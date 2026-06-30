export interface INotificationClient {
  sendNotification(userId: string, message: string): Promise<boolean>;
}
