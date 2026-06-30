import { Request, Response } from 'express';
import { emitToUser } from '../websocket/socket.gateway';
import { successResponse } from '../utils/response';
import { logger } from '../config/logger';

export const pushTestNotification = async (req: Request, res: Response) => {
  try {
    const { userId, eventName, payload } = req.body;
    
    emitToUser(userId, eventName, payload);
    
    return successResponse(res, 200, 'Test notification pushed successfully');
  } catch (error) {
    logger.error('Error pushing test notification', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
