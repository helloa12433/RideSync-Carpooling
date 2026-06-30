export interface AutoshiftResponseDto {
  id: string;
  rideId: string;
  oldDriverId: string;
  newDriverId: string | null;
  reason: string;
  type: string;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
}
