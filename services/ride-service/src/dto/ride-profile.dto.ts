export interface RideProfileDto {
  id: string;
  driver_id: string;
  vehicle_id: string;
  source_location: string;
  destination_location: string;
  distance: number;
  departure_time: Date;
  estimated_arrival_time: Date;
  total_seats: number;
  available_seats: number;
  price_per_seat: number;
  status: string;
  visibility: string;
  created_at: Date;
  updated_at: Date;
}
