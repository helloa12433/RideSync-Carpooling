export interface IRideClient {
  getRideDetails(rideId: string): Promise<any>;
}
