import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { sendError } from '../utils/response';

export const validate = (schema: ObjectSchema | import('joi').ArraySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate request body, params, or query if necessary
    // Here we assume validating the body
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return sendError(res, 400, 'Validation Error', errors);
    }

    next();
  };
};
