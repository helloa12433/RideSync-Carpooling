export interface IAutoshift {
  id: string;
  ride_id: string;
  old_driver_id: string;
  new_driver_id: string | null;
  reason: string;
  type: string; // 'REPLACEMENT' or 'TRANSFER'
  status: string;
  created_at: Date;
  completed_at: Date | null;
}
