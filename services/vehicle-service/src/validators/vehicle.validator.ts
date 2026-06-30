import joi from 'joi';

export const createVehicleSchema = joi.object({
  driver_id: joi.string().uuid().required(),
  make: joi.string().min(2).max(50).required(),
  model: joi.string().min(2).max(50).required(),
  year: joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required(),
  license_plate: joi.string().min(4).max(20).required(),
  capacity: joi.number().integer().min(1).max(20).required(),
  color: joi.string().min(2).max(30).required(),
});

export const updateVehicleSchema = joi.object({
  make: joi.string().min(2).max(50),
  model: joi.string().min(2).max(50),
  year: joi.number().integer().min(1990).max(new Date().getFullYear() + 1),
  license_plate: joi.string().min(4).max(20),
  capacity: joi.number().integer().min(1).max(20),
  color: joi.string().min(2).max(30),
  status: joi.string().valid('ACTIVE', 'INACTIVE', 'MAINTENANCE'),
}).min(1);

export const vehicleDocumentSchema = joi.object({
  type: joi.string().valid('INSURANCE', 'REGISTRATION', 'PERMIT').required(),
  url: joi.string().uri().required(),
});

export const seatLayoutSchema = joi.array().items(
  joi.object({
    seat_number: joi.string().required(),
    is_available: joi.boolean().default(true),
    position_x: joi.number().integer().required(),
    position_y: joi.number().integer().required(),
  })
).min(1);
