export interface CreateRideDto {
  driver_id: string;
  vehicle_id: string;
  source_location: string;
  source_lat: number;
  source_lng: number;
  destination_location: string;
  destination_lat: number;
  destination_lng: number;
  departure_time: Date;
  total_seats: number;
  price_per_seat: number;
  offered_seats?: string[];
}
