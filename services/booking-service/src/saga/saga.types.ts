export interface PaymentSuccessEvent {
  bookingId: string;
  transactionId: string;
  amount: number;
}

export interface PaymentFailedEvent {
  bookingId: string;
  reason: string;
}

export interface RideCancelledEvent {
  rideId: string;
  reason: string;
}
