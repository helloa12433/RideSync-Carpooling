export interface IBookingClient {
  getBookingByRideId(rideId: string): Promise<any>;
  updateBookingDriver(bookingId: string, newDriverId: string): Promise<any>;
}
