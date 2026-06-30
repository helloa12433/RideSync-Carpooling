export interface IMatchingClient {
  requestNewDriver(rideId: string, pickupLat: number, pickupLon: number, excludeDriverId: string): Promise<any>;
}
