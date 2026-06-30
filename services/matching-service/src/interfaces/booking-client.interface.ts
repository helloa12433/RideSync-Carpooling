export interface IBookingClient {
  notifyBookingConfirmed(bookingId: string, driverId: string): Promise<boolean>;
}
