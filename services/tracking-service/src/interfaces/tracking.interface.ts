export interface ITracking {
  id: string;
  ride_id: string;
  route: string;
  distance_km: number;
  status: string;
  started_at: Date;
  completed_at: Date | null;
}
