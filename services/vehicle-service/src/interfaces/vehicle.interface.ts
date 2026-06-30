export interface IVehicle {
  id: string;
  driver_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  capacity: number;
  color: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
