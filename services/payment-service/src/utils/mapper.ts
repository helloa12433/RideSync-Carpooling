export const mapPaymentToDto = (payment: any) => {
  return {
    id: payment.id,
    bookingId: payment.booking_id,
    userId: payment.user_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
  };
};
