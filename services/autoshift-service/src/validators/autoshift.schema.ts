import joi from 'joi';

export const triggerAutoshiftSchema = joi.object({
  rideId: joi.string().uuid().required(),
  driverId: joi.string().uuid().required(),
  reason: joi.string().valid(
    'DRIVER_OFFLINE',
    'DRIVER_CANCELLED',
    'VEHICLE_BREAKDOWN',
    'ENGINE_FAILURE',
    'TYRE_PUNCTURE',
    'DRIVER_ACCIDENT',
    'DRIVER_EMERGENCY',
    'RIDE_EMERGENCY'
  ).required(),
});
