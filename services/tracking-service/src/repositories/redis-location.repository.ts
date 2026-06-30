import { redisClient } from '../config/redis';
import { REDIS_KEYS } from '../utils/constants';

export class RedisLocationRepository {
  async setLocation(role: 'driver' | 'passenger', entityId: string, lat: number, lon: number): Promise<void> {
    const key = `${REDIS_KEYS.LIVE_LOCATION}${role}:${entityId}`;
    await redisClient.set(key, JSON.stringify({ lat, lon, timestamp: Date.now() }));
    // Expire location after 15 mins to avoid stale data
    await redisClient.expire(key, 900); 
  }

  async getLocation(role: 'driver' | 'passenger', entityId: string): Promise<{ lat: number; lon: number; timestamp: number } | null> {
    const key = `${REDIS_KEYS.LIVE_LOCATION}${role}:${entityId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async appendToRoute(rideId: string, lat: number, lon: number): Promise<void> {
    const key = `route:${rideId}`;
    await redisClient.rPush(key, JSON.stringify({ lat, lon }));
  }

  async getRoute(rideId: string): Promise<{ lat: number; lon: number }[]> {
    const key = `route:${rideId}`;
    const data = await redisClient.lRange(key, 0, -1);
    return data.map(item => JSON.parse(item));
  }
}

export const redisLocationRepository = new RedisLocationRepository();
