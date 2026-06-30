export interface IBookingClient {
  getBookingDetails(bookingId: string): Promise<any>;
}
