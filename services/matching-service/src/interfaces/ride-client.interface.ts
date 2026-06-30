export interface IRideClient {
  getRideDetails(rideId: string): Promise<any>;
  updateRideStatus(rideId: string, status: string, driverId: string): Promise<boolean>;
}
