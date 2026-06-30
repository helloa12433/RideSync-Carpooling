export interface DriverStatusDto {
  driver_id: string;
  status: string;
  current_ride_id: string | null;
  current_vehicle_id: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: Date;
}
