import joi from 'joi';

export const createBookingSchema = joi.object({
  rideId: joi.string().uuid().required(),
  seats: joi.number().integer().min(1).max(10).required(),
  totalPrice: joi.number().min(0).required(),
});

export const updateBookingSchema = joi.object({
  status: joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED').required(),
});
