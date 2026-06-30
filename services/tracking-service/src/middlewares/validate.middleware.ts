import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, errorMessage);
    }
    
    next();
  };
};
