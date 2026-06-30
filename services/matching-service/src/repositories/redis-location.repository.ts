import { redisClient } from '../config/redis';
import { REDIS_KEYS } from '../utils/constants';
import { DriverCandidateDto } from '../dto/driver-candidate.dto';

export class RedisLocationRepository {
  async updateDriverLocation(driverId: string, lon: number, lat: number): Promise<void> {
    await redisClient.geoAdd(REDIS_KEYS.DRIVER_LOCATION, {
      longitude: lon,
      latitude: lat,
      member: driverId,
    });
  }

  async findNearbyDrivers(lon: number, lat: number, radiusKm: number): Promise<DriverCandidateDto[]> {
    const results = await redisClient.geoSearchWith(
      REDIS_KEYS.DRIVER_LOCATION,
      { longitude: lon, latitude: lat },
      { radius: radiusKm, unit: 'km' },
      ['WITHDIST', 'WITHCOORD']
    );

    return results.map((result) => ({
      driverId: result.member,
      distance: result.distance as number,
    }));
  }

  async removeDriverLocation(driverId: string): Promise<void> {
    await redisClient.zRem(REDIS_KEYS.DRIVER_LOCATION, driverId);
  }
}

export const redisLocationRepository = new RedisLocationRepository();
