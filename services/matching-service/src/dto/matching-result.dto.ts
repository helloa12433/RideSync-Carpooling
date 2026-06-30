export interface MatchingResultDto {
  success: boolean;
  rideId: string;
  driverId?: string;
  eta?: number;
  message: string;
}
