import { Request, Response, NextFunction } from 'express';
import { driverService } from '../services/driver.service';
import { sendSuccess, sendError } from '../utils/response';
import { mapDriverToProfileDto } from '../utils/mapper';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { DriverStatusDto } from '../dto/driver-status.dto';

export class DriverController {
  public async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createDto: CreateDriverDto = {
        user_id: req.body.user_id,
        license_number: req.body.license_number,
      };

      const driver = await driverService.createProfile(createDto);
      sendSuccess(res, 201, 'Driver profile created', mapDriverToProfileDto(driver));
    } catch (error: any) {
      if (error.message === 'Driver profile already exists for this user') {
        sendError(res, 409, error.message);
      } else {
        next(error);
      }
    }
  }

  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      const driver = await driverService.getProfileByUserId(userId);
      
      if (!driver) {
        sendError(res, 404, 'Driver profile not found');
        return;
      }

      sendSuccess(res, 200, 'Driver profile retrieved', mapDriverToProfileDto(driver));
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Driver Service Started');
      console.log('↓');
      console.log('\\n[DriverController] Incoming Edit Profile Request');
      console.log('[DriverController] Payload:', JSON.stringify(req.body));

      const userId = (req as any).user?.userId;
      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      console.log('Payload Validated');
      console.log('↓');
      console.log('[DriverController] Validated Payload (proceeding to Service):', JSON.stringify(req.body));

      const updatedDriver = await driverService.updateProfileByUserId(userId, req.body);
      
      if (!updatedDriver) {
        console.log('[DriverController] Update Failed: Driver not found');
        sendError(res, 404, 'Driver profile not found');
        return;
      }

      console.log('[DriverController] Profile Update Success');
      console.log('Returning HTTP 200 Response');
      console.log('↓');
      sendSuccess(res, 200, 'Driver profile updated', mapDriverToProfileDto(updatedDriver));
    } catch (error: any) {
      console.error('[DriverController] Update Profile Failed:', error.message);
      next(error);
    }
  }

  public async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.params.id;
      const statusUpdate: Partial<DriverStatusDto> = req.body;
      
      const updatedStatus = await driverService.updateStatus(driverId, statusUpdate);
      sendSuccess(res, 200, 'Driver status updated', updatedStatus);
    } catch (error) {
      next(error);
    }
  }

  public async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.params.id;
      const status = await driverService.getStatus(driverId);
      
      if (!status) {
        sendError(res, 404, 'Driver status not found');
        return;
      }

      sendSuccess(res, 200, 'Driver status retrieved', status);
    } catch (error) {
      next(error);
    }
  }
}

export const driverController = new DriverController();
