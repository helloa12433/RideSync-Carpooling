export const mapBookingToDto = (booking: any) => {
  return {
    id: booking.id,
    rideId: booking.ride_id,
    userId: booking.user_id,
    status: booking.status,
    seats: booking.seats,
    totalPrice: booking.total_price,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  };
};
