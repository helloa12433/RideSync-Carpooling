export interface IRide {
  id: string;
  driver_id: string;
  vehicle_id: string;
  source_location: string;
  source_lat: number;
  source_lng: number;
  destination_location: string;
  destination_lat: number;
  destination_lng: number;
  distance: number;
  departure_time: Date;
  estimated_arrival_time: Date;
  total_seats: number;
  available_seats: number;
  price_per_seat: number;
  status: string;
  visibility: string;
  offered_seats?: string[];
  available_seats_list?: string[];
  created_at: Date;
  updated_at: Date;
}
