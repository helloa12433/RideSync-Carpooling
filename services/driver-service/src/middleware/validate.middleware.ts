import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { sendError } from '../utils/response';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      sendError(res, 400, 'Validation failed', errorDetails);
      return;
    }

    req.body = value;
    next();
  };
};
