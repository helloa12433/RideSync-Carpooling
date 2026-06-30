export interface ConfirmPaymentDto {
  paymentId: string;
  transactionId?: string; // e.g. from Stripe/PayPal
}
