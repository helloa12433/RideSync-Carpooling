export interface TrackingResponseDto {
  rideId: string;
  driverId?: string;
  driverLocation?: {
    lat: number;
    lon: number;
  };
  passengerLocation?: {
    lat: number;
    lon: number;
  };
  etaMinutes?: number;
  status: string;
}
