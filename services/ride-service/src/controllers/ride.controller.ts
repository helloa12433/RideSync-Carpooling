import { Request, Response, NextFunction } from 'express';
import { rideService } from '../services/ride.service';
import { sendSuccess, sendError } from '../utils/response';
import { toRideProfileDto } from '../utils/mapper';

class RideController {
  public async createRide(req: Request, res: Response, next: NextFunction) {
    try {
      const ride = await rideService.createRide(req.body);
      sendSuccess(res, 201, 'Ride created successfully', toRideProfileDto(ride));
    } catch (error) {
      next(error);
    }
  }

  public async publishRide(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ride = await rideService.publishRide(id);

      if (!ride) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride published successfully', toRideProfileDto(ride));
    } catch (error) {
      next(error);
    }
  }

  public async getRide(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ride = await rideService.getRide(id);

      if (!ride) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride retrieved successfully', toRideProfileDto(ride));
    } catch (error) {
      next(error);
    }
  }

  public async getDriverRides(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = (req as any).user?.userId;
      if (!driverId) return sendError(res, 401, 'Unauthorized');

      const rides = await rideService.getDriverRides(driverId);
      sendSuccess(res, 200, 'Driver rides retrieved', rides.map(toRideProfileDto));
    } catch (error) {
      next(error);
    }
  }

  public async searchRides(req: Request, res: Response, next: NextFunction) {
    try {
      const { source, destination } = req.query;
      if (!source || !destination) {
        return sendError(res, 400, 'Source and destination are required');
      }

      const rides = await rideService.searchRides(source as string, destination as string);
      sendSuccess(res, 200, 'Rides retrieved successfully', rides.map(toRideProfileDto));
    } catch (error) {
      next(error);
    }
  }

  public async updateRide(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedRide = await rideService.updateRide(id, req.body);

      if (!updatedRide) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride updated successfully', toRideProfileDto(updatedRide));
    } catch (error) {
      next(error);
    }
  }

  public async cancelRide(req: Request, res: Response, next: NextFunction) {
    try {
      const cancelledRide = await rideService.cancelRide(req.body);
      
      if (!cancelledRide) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride cancelled successfully. Refund is being processed.', toRideProfileDto(cancelledRide));
    } catch (error: any) {
      if (error.message.includes('Cannot cancel ride in status')) {
        return sendError(res, 400, error.message);
      }
      next(error);
    }
  }

  public async startRide(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ride = await rideService.startRide(id);

      if (!ride) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride started successfully', toRideProfileDto(ride));
    } catch (error) {
      next(error);
    }
  }

  public async completeRide(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ride = await rideService.completeRide(id);

      if (!ride) return sendError(res, 404, 'Ride not found');

      sendSuccess(res, 200, 'Ride completed successfully', toRideProfileDto(ride));
    } catch (error) {
      next(error);
    }
  }
}

export const rideController = new RideController();
