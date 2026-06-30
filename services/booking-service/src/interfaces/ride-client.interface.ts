export interface IRideClient {
  verifyRideAvailability(rideId: string, requestedSeats: number): Promise<boolean>;
  reserveSeats(rideId: string, requestedSeats: number): Promise<boolean>;
  releaseSeats(rideId: string, seats: number): Promise<boolean>;
}
