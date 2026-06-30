import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { logger } from '../config/logger';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  logger.info('[DriverService] Authorization Header Received', {
    present: !!authHeader,
    prefix: authHeader?.substring(0, 15) || 'MISSING',
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('[DriverService] JWT Verification Failed: Missing or malformed Authorization header');
    sendError(res, 401, 'Authentication token missing or invalid');
    return;
  }

  const token = authHeader.split(' ')[1];
  logger.info('[DriverService] JWT Extracted — Verification Starting...');

  if (!env.JWT_SECRET) {
    logger.error('[DriverService] FATAL: JWT_ACCESS_SECRET is not set in environment. Check .env file.');
    sendError(res, 500, 'Server misconfiguration: JWT secret not loaded');
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string; client_type?: string };

    logger.info('[DriverService] JWT Verification SUCCESS', {
      userId: payload.userId,
      role: payload.role,
      client_type: payload.client_type || 'not_set',
    });

    req.user = { userId: payload.userId, email: '', role: payload.role, client_type: payload.client_type };
    next();
  } catch (error: any) {
    logger.error('[DriverService] JWT Verification FAILED', {
      reason: error.message,
      name: error.name,
    });
    sendError(res, 401, `Token verification failed: ${error.message}`);
  }
};
