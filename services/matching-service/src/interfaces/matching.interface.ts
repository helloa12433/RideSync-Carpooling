export interface IMatching {
  id: string;
  ride_id: string;
  status: string;
  assigned_driver_id?: string;
  created_at: Date;
  updated_at: Date;
}
