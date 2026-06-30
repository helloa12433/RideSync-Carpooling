import { Request, Response, NextFunction } from 'express';

// Placeholder for future validation logic (e.g. using Zod or Joi)
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // validation logic here
    next();
  };
};
