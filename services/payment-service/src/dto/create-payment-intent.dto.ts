export interface CreatePaymentIntentDto {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
}
