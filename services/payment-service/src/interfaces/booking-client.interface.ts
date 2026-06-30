export interface IBookingClient {
  getBookingDetails(bookingId: string): Promise<any>;
}

export interface IRideClient {
  getRideDetails(rideId: string): Promise<any>;
}

export interface INotificationClient {
  sendNotification(userId: string, message: string): Promise<boolean>;
}
