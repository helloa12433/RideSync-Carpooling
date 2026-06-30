export interface WebhookDto {
  eventId: string;
  eventType: string; // e.g., 'payment_intent.succeeded'
  data: {
    object: {
      id: string; // payment gateway's intent id
      metadata: {
        paymentId: string;
        bookingId: string;
      };
      [key: string]: any;
    };
  };
}
