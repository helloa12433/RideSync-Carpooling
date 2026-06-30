import { Request, Response } from 'express';
import { autoshiftService } from '../services/autoshift.service';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';
import { mapAutoshiftToDto } from '../utils/mapper';

export class AutoshiftController {
  /**
   * POST /api/v1/autoshift/trigger
   * Manual trigger (used by internal services or admin).
   * Normally autoshift is triggered via Kafka events.
   */
  async triggerAutoshift(req: Request, res: Response) {
    try {
      const { rideId, driverId, reason } = req.body;

      // Fire-and-forget — the actual processing is async
      autoshiftService.handleEvent(rideId, driverId, reason);

      return sendResponse(res, HTTP_STATUS.OK, true, 'AutoShift triggered');
    } catch (error: any) {
      logger.error('Error in triggerAutoshift controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to trigger autoshift');
    }
  }

  async getAutoshiftHistory(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const history = await autoshiftService.getAutoshiftHistory(rideId);
      const mapped = history.map(mapAutoshiftToDto);

      return sendResponse(res, HTTP_STATUS.OK, true, 'AutoShift history retrieved', mapped);
    } catch (error: any) {
      logger.error('Error in getAutoshiftHistory controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve history');
    }
  }

  async getAutoshiftById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const autoshift = await autoshiftService.getAutoshiftById(id);

      if (!autoshift) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, 'AutoShift record not found');
      }

      return sendResponse(res, HTTP_STATUS.OK, true, 'AutoShift record retrieved', mapAutoshiftToDto(autoshift));
    } catch (error: any) {
      logger.error('Error in getAutoshiftById controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve autoshift');
    }
  }
}

export const autoshiftController = new AutoshiftController();
