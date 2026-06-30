import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('[AuthController] Incoming Google Login Request');
    const { idToken, client_type } = req.body;
    const clientType = (req.headers['x-client-type'] as string) || client_type || 'user';
    
    logger.info('[AuthController] Client Type', { clientType });
    
    if (!idToken) {
      logger.warn('[AuthController] Google Login failed: idToken is missing');
      return res.status(400).json({ message: 'idToken is required' });
    }

    const result = await authService.googleLogin(idToken, clientType);
    logger.info('[AuthController] Sending Authentication Response');
    res.status(200).json(result);
  } catch (error) {
    logger.error('[AuthController] Error during Google Login', { error: (error as Error).message });
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Incoming Refresh Token Request received');
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn('Refresh failed: refreshToken is missing');
      return res.status(400).json({ message: 'refreshToken is required' });
    }

    const result = await authService.refresh(refreshToken);
    logger.info('Refresh successful, new tokens generated');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error during Token Refresh', { error: (error as Error).message });
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    logger.info('Incoming Logout Request received', { userId });
    if (!userId) {
      logger.warn('Logout failed: Unauthorized');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await authService.logout(userId);
    logger.info('Logout successful', { userId });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Error during Logout', { error: (error as Error).message });
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await authService.getMe(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const { role } = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!role || (role !== 'USER' && role !== 'DRIVER')) {
      return res.status(400).json({ message: 'Valid role (USER or DRIVER) is required' });
    }

    const result = await authService.updateRole(userId, role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
