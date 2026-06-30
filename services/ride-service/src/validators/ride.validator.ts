import joi from 'joi';

export const createRideSchema = joi.object({
  driver_id: joi.string().required(),
  vehicle_id: joi.string().required(),
  source_location: joi.string().required(),
  source_lat: joi.number().min(-90).max(90).required(),
  source_lng: joi.number().min(-180).max(180).required(),
  destination_location: joi.string().required(),
  destination_lat: joi.number().min(-90).max(90).required(),
  destination_lng: joi.number().min(-180).max(180).required(),
  departure_time: joi.date().iso().min('now').required(),
  total_seats: joi.number().integer().min(1).max(20).required(),
  price_per_seat: joi.number().min(0).required(),
  offered_seats: joi.array().items(joi.string()).optional(),
});

export const updateRideSchema = joi.object({
  departure_time: joi.date().iso().min('now'),
  total_seats: joi.number().integer().min(1).max(20),
  price_per_seat: joi.number().min(0),
  visibility: joi.string().valid('PUBLIC', 'PRIVATE'),
}).min(1);

export const cancelRideSchema = joi.object({
  ride_id: joi.string().uuid().required(),
  reason: joi.string().max(255).required(),
});
