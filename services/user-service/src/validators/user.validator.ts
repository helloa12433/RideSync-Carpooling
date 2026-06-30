import Joi from 'joi';
import { ROLES } from '../utils/constants';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  phone_number: Joi.string().optional(),
  role: Joi.string().valid(ROLES.RIDER, ROLES.DRIVER, ROLES.ADMIN).optional(),
});

export const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone_number: Joi.string().allow('', null).optional(),
  country_code: Joi.string().allow('', null).optional(),
});
