import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('JWT Verification Failed: Authentication token missing or invalid format');
    sendError(res, 401, 'Authentication token missing or invalid');
    return;
  }

  const token = authHeader.split(' ')[1];
  logger.info('Extracting JWT for verification');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    };
    logger.info('JWT Verified Successfully', { userId: payload.userId });
    next();
  } catch (error) {
    logger.error('JWT Verification Failed', { error: (error as Error).message });
    sendError(res, 401, 'Token expired or invalid');
  }
};
