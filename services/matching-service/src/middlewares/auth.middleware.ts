import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Unauthorized access attempt: No token provided');
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized: No token provided');
    }

    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;

    if (!userId) {
      logger.warn('Unauthorized access attempt: Invalid token payload');
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized: Invalid token');
    }

    req.user = {
      id: userId,
      role: userRole || 'USER',
    };

    next();
  } catch (error) {
    logger.error('Authentication error', error);
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized');
  }
};
