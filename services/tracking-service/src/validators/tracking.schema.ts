import joi from 'joi';

export const updateLocationSchema = joi.object({
  rideId: joi.string().uuid().required(),
  driverId: joi.string().uuid().required(),
  lat: joi.number().min(-90).max(90).required(),
  lon: joi.number().min(-180).max(180).required(),
});
