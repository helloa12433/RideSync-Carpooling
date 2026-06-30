export interface IRideClient {
  getRideDetails(rideId: string): Promise<any>;
  updateRideDriver(rideId: string, newDriverId: string): Promise<any>;
}
