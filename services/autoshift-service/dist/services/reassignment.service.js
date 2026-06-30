"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reassignmentService = exports.ReassignmentService = void 0;
const redis_1 = require("../config/redis");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
class ReassignmentService {
    /**
     * Acquires a distributed lock so only one autoshift runs per ride at a time.
     * Returns true if lock acquired, false if another autoshift is already running.
     */
    async acquireLock(rideId) {
        const lockKey = `${constants_1.REDIS_KEYS.AUTOSHIFT_LOCK}${rideId}`;
        // SET NX with 5-minute TTL
        const result = await redis_1.redisClient.set(lockKey, 'locked', { NX: true, EX: 300 });
        if (result === 'OK') {
            logger_1.logger.info(`AutoShift lock acquired for ride ${rideId}`);
            return true;
        }
        logger_1.logger.warn(`AutoShift lock already held for ride ${rideId}. Skipping.`);
        return false;
    }
    async releaseLock(rideId) {
        const lockKey = `${constants_1.REDIS_KEYS.AUTOSHIFT_LOCK}${rideId}`;
        await redis_1.redisClient.del(lockKey);
        logger_1.logger.info(`AutoShift lock released for ride ${rideId}`);
    }
    async saveState(rideId, state) {
        const stateKey = `${constants_1.REDIS_KEYS.AUTOSHIFT_STATE}${rideId}`;
        await redis_1.redisClient.set(stateKey, JSON.stringify(state), { EX: 600 });
    }
    async getState(rideId) {
        const stateKey = `${constants_1.REDIS_KEYS.AUTOSHIFT_STATE}${rideId}`;
        const data = await redis_1.redisClient.get(stateKey);
        return data ? JSON.parse(data) : null;
    }
}
exports.ReassignmentService = ReassignmentService;
exports.reassignmentService = new ReassignmentService();
