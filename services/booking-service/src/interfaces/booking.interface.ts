export interface IBooking {
  id: string;
  ride_id: string;
  user_id: string;
  status: string;
  seats: number;
  total_price: number;
  created_at: Date;
  updated_at: Date;
}
