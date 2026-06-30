export interface RideTransferDto {
  rideId: string;
  oldDriverId: string;
  passengerId: string;
  reason: string;
  currentLat: number;
  currentLon: number;
}
