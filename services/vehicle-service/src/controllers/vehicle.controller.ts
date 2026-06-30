import { Request, Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { sendSuccess, sendError } from '../utils/response';
import { toVehicleProfileDto } from '../utils/mapper';

class VehicleController {
  public async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleData = req.body;
      const vehicle = await vehicleService.createProfile(vehicleData);
      sendSuccess(res, 201, 'Vehicle profile created successfully', toVehicleProfileDto(vehicle));
    } catch (error: any) {
      if (error.message === 'Vehicle profile already exists for this driver') {
        sendError(res, 400, error.message);
      } else {
        next(error);
      }
    }
  }

  public async getDriverVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = (req as any).user?.userId;
      if (!driverId) return sendError(res, 401, 'Unauthorized');

      const vehicles = await vehicleService.getDriverVehicles(driverId);
      sendSuccess(res, 200, 'Vehicles retrieved successfully', vehicles.map(toVehicleProfileDto));
    } catch (error) {
      next(error);
    }
  }

  public async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getProfile(id);

      if (!vehicle) {
        return sendError(res, 404, 'Vehicle not found');
      }

      sendSuccess(res, 200, 'Vehicle profile retrieved successfully', toVehicleProfileDto(vehicle));
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedVehicle = await vehicleService.updateProfile(id, updateData);

      if (!updatedVehicle) {
        return sendError(res, 404, 'Vehicle not found');
      }

      sendSuccess(res, 200, 'Vehicle profile updated successfully', toVehicleProfileDto(updatedVehicle));
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
