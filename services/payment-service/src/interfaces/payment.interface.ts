export interface IPayment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
