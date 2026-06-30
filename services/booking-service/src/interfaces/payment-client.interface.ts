export interface IPaymentClient {
  processPayment(userId: string, amount: number, bookingId: string): Promise<boolean>;
  refundPayment(userId: string, amount: number, bookingId: string): Promise<boolean>;
}
