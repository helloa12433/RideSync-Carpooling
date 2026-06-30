import { redisClient } from '../config/redis';
import { REDIS_KEYS } from '../utils/constants';
import { logger } from '../config/logger';

export class ReassignmentService {
  /**
   * Acquires a distributed lock so only one autoshift runs per ride at a time.
   * Returns true if lock acquired, false if another autoshift is already running.
   */
  async acquireLock(rideId: string): Promise<boolean> {
    const lockKey = `${REDIS_KEYS.AUTOSHIFT_LOCK}${rideId}`;
    // SET NX with 5-minute TTL
    const result = await redisClient.set(lockKey, 'locked', { NX: true, EX: 300 });
    if (result === 'OK') {
      logger.info(`AutoShift lock acquired for ride ${rideId}`);
      return true;
    }
    logger.warn(`AutoShift lock already held for ride ${rideId}. Skipping.`);
    return false;
  }

  async releaseLock(rideId: string): Promise<void> {
    const lockKey = `${REDIS_KEYS.AUTOSHIFT_LOCK}${rideId}`;
    await redisClient.del(lockKey);
    logger.info(`AutoShift lock released for ride ${rideId}`);
  }

  async saveState(rideId: string, state: any): Promise<void> {
    const stateKey = `${REDIS_KEYS.AUTOSHIFT_STATE}${rideId}`;
    await redisClient.set(stateKey, JSON.stringify(state), { EX: 600 });
  }

  async getState(rideId: string): Promise<any> {
    const stateKey = `${REDIS_KEYS.AUTOSHIFT_STATE}${rideId}`;
    const data = await redisClient.get(stateKey);
    return data ? JSON.parse(data) : null;
  }
}

export const reassignmentService = new ReassignmentService();
