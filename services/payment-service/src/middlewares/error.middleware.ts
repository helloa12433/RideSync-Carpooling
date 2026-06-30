import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error caught by middleware', err);
  
  return sendResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    false,
    'Internal Server Error'
  );
};
