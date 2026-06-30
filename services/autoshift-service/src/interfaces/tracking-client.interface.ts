export interface ITrackingClient {
  updateTrackingDriver(rideId: string, newDriverId: string): Promise<any>;
}
