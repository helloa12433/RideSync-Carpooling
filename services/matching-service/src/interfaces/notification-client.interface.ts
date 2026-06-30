export interface IDriverClient {
  getDriverDetails(driverId: string): Promise<any>;
  updateDriverStatus(driverId: string, status: string): Promise<boolean>;
}

export interface INotificationClient {
  sendNotification(userId: string, message: string): Promise<boolean>;
}
