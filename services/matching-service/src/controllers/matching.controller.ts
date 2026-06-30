import { Request, Response } from 'express';
import { matchingService } from '../services/matching.service';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class MatchingController {
  async processMatching(req: Request, res: Response) {
    try {
      const { rideId, pickupLat, pickupLon } = req.body;

      // Processing happens asynchronously
      matchingService.processMatching({
        rideId,
        pickupLat,
        pickupLon,
      }).catch(err => {
        logger.error(`Async matching process failed for ride ${rideId}`, err);
      });

      return sendResponse(res, HTTP_STATUS.CREATED, true, 'Matching request received and is being processed');
    } catch (error: any) {
      logger.error('Error in processMatching controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to start matching process');
    }
  }

  async searchRides(req: Request, res: Response) {
    try {
      const { source, destination, date, passengers } = req.query;
      
      if (!source || !destination || !date) {
        return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, 'Source, destination, and date are required');
      }

      const { rideIndexRepository } = await import('../repositories/ride-index.repository');
      const rides = await rideIndexRepository.searchRides(
        source as string,
        destination as string,
        date as string,
        parseInt(passengers as string) || 1
      );

      return sendResponse(res, HTTP_STATUS.OK, true, 'Rides retrieved successfully', rides);
    } catch (error: any) {
      logger.error('Error in searchRides controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, 'Failed to search rides');
    }
  }
}

export const matchingController = new MatchingController();
