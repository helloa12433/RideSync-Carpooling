export interface PaymentStatusDto {
  paymentId: string;
  status: string;
  bookingId: string;
  amount: number;
  currency: string;
}
