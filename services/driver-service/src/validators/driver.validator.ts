import Joi from 'joi';
import { DRIVER_STATUS, VERIFICATION_STATUS } from '../utils/constants';

export const createDriverSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  license_number: Joi.string().min(5).max(30).optional().allow(''),
  first_name: Joi.string().optional().allow(''),
  last_name: Joi.string().optional().allow(''),
  email: Joi.string().email().optional().allow(''),
});

export const updateDriverSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  phone_number: Joi.string().optional(),
  country_code: Joi.string().optional(),
  profile_picture: Joi.string().optional(),
  license_number: Joi.string().min(5).max(30).optional(),
  verification_status: Joi.string().valid(
    VERIFICATION_STATUS.PENDING,
    VERIFICATION_STATUS.VERIFIED,
    VERIFICATION_STATUS.REJECTED
  ).optional(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(
    DRIVER_STATUS.ONLINE,
    DRIVER_STATUS.OFFLINE,
    DRIVER_STATUS.ON_RIDE
  ).required(),
  current_vehicle_id: Joi.string().uuid().optional().allow(null),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
});
