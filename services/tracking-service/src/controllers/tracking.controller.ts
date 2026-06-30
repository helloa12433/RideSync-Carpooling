import { Request, Response } from 'express';
import { trackingService } from '../services/tracking.service';
import { tripHistoryService } from '../services/trip-history.service';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';
import { mapTripHistoryToDto } from '../utils/mapper';

export class TrackingController {
  async updateDriverLocation(req: Request, res: Response) {
    try {
      const { rideId, lat, lon, driverId } = req.body;

      await trackingService.updateDriverLocation({ rideId, driverId, lat, lon });

      return sendResponse(res, HTTP_STATUS.OK, true, 'Location updated successfully');
    } catch (error: any) {
      logger.error('Error in updateDriverLocation controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to update location');
    }
  }

  async getTrackingState(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const { driverId, passengerId } = req.query;

      if (!driverId || !passengerId) {
        return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, 'driverId and passengerId query params required');
      }

      const state = await trackingService.getTrackingState(
        rideId, 
        driverId as string, 
        passengerId as string
      );

      return sendResponse(res, HTTP_STATUS.OK, true, 'Tracking state retrieved', state);
    } catch (error: any) {
      logger.error('Error in getTrackingState controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve tracking state');
    }
  }

  async getTripHistory(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const history = await tripHistoryService.getTripHistory(rideId);

      if (!history) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, 'Trip history not found');
      }

      return sendResponse(res, HTTP_STATUS.OK, true, 'Trip history retrieved', mapTripHistoryToDto(history));
    } catch (error: any) {
      logger.error('Error in getTripHistory controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve trip history');
    }
  }
}

export const trackingController = new TrackingController();
