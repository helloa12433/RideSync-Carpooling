import joi from 'joi';

export const createMatchingSchema = joi.object({
  rideId: joi.string().uuid().required(),
  pickupLat: joi.number().min(-90).max(90).required(),
  pickupLon: joi.number().min(-180).max(180).required(),
});
