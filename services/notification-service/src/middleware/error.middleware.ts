import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};
