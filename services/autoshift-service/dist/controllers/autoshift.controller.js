"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoshiftController = exports.AutoshiftController = void 0;
const autoshift_service_1 = require("../services/autoshift.service");
const response_1 = require("../utils/response");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
const mapper_1 = require("../utils/mapper");
class AutoshiftController {
    /**
     * POST /api/v1/autoshift/trigger
     * Manual trigger (used by internal services or admin).
     * Normally autoshift is triggered via Kafka events.
     */
    async triggerAutoshift(req, res) {
        try {
            const { rideId, driverId, reason } = req.body;
            // Fire-and-forget — the actual processing is async
            autoshift_service_1.autoshiftService.handleEvent(rideId, driverId, reason);
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.OK, true, 'AutoShift triggered');
        }
        catch (error) {
            logger_1.logger.error('Error in triggerAutoshift controller', error);
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to trigger autoshift');
        }
    }
    async getAutoshiftHistory(req, res) {
        try {
            const { rideId } = req.params;
            const history = await autoshift_service_1.autoshiftService.getAutoshiftHistory(rideId);
            const mapped = history.map(mapper_1.mapAutoshiftToDto);
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.OK, true, 'AutoShift history retrieved', mapped);
        }
        catch (error) {
            logger_1.logger.error('Error in getAutoshiftHistory controller', error);
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve history');
        }
    }
    async getAutoshiftById(req, res) {
        try {
            const { id } = req.params;
            const autoshift = await autoshift_service_1.autoshiftService.getAutoshiftById(id);
            if (!autoshift) {
                return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.NOT_FOUND, false, 'AutoShift record not found');
            }
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.OK, true, 'AutoShift record retrieved', (0, mapper_1.mapAutoshiftToDto)(autoshift));
        }
        catch (error) {
            logger_1.logger.error('Error in getAutoshiftById controller', error);
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve autoshift');
        }
    }
}
exports.AutoshiftController = AutoshiftController;
exports.autoshiftController = new AutoshiftController();
