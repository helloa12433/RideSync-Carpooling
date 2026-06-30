import { driverRepository } from '../repositories/driver.repository';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { DriverStatusDto } from '../dto/driver-status.dto';
import { IDriver } from '../interfaces/driver.interface';
import { redisClient } from '../config/redis';
import { publishEvent } from '../events/producer';
import { TOPICS, DRIVER_STATUS } from '../utils/constants';

export class DriverService {
  public async createProfile(driverData: CreateDriverDto): Promise<IDriver> {
    const existingDriver = await driverRepository.findByUserId(driverData.user_id);
    if (existingDriver) {
      throw new Error('Driver profile already exists for this user');
    }

    const driver = await driverRepository.create(driverData);

    await publishEvent(TOPICS.DRIVER_CREATED, { id: driver.id, user_id: driver.user_id });

    return driver;
  }

  public async getProfile(id: string): Promise<IDriver | null> {
    const cacheKey = `driver_profile:${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as IDriver;
    }

    const driver = await driverRepository.findById(id);

    if (driver) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(driver));
    }

    return driver;
  }

  public async getProfileByUserId(userId: string): Promise<IDriver | null> {
    const cacheKey = `driver_profile_user:${userId}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as IDriver;
    }

    const driver = await driverRepository.findByUserId(userId);

    if (driver) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(driver));
      await redisClient.setex(`driver_profile:${driver.id}`, 3600, JSON.stringify(driver));
    }

    return driver;
  }

  public async updateProfile(id: string, updateData: UpdateDriverDto): Promise<IDriver | null> {
    const updatedDriver = await driverRepository.update(id, updateData);

    if (updatedDriver) {
      await redisClient.del(`driver_profile:${id}`);
      await redisClient.del(`driver_profile_user:${updatedDriver.user_id}`);

      // Fire-and-forget: do NOT await so HTTP 200 is returned immediately
      publishEvent(TOPICS.DRIVER_UPDATED, {
        id:      updatedDriver.id,
        user_id: updatedDriver.user_id,
        updates: updateData,
        timestamp: new Date().toISOString(),
      }).catch((err: any) => {
        console.error('[DriverService] Failed to publish driver.updated event:', err.message);
      });

      if (updateData.verification_status) {
        publishEvent(TOPICS.DRIVER_VERIFICATION_UPDATED, {
          id:     updatedDriver.id,
          status: updatedDriver.verification_status,
        }).catch(() => {});
      }
    }

    return updatedDriver;
  }

  public async updateProfileByUserId(userId: string, updateData: UpdateDriverDto): Promise<IDriver | null> {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) return null;
    
    return this.updateProfile(driver.id, updateData);
  }

  public async updateStatus(driverId: string, statusData: Partial<DriverStatusDto>): Promise<DriverStatusDto> {
    const cacheKey = `driver_status:${driverId}`;
    let currentStatus: DriverStatusDto = {
      driver_id: driverId,
      status: DRIVER_STATUS.OFFLINE,
      current_ride_id: null,
      current_vehicle_id: null,
      latitude: null,
      longitude: null,
      updated_at: new Date(),
    };

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      currentStatus = JSON.parse(cached) as DriverStatusDto;
    }

    const updatedStatus = { ...currentStatus, ...statusData, updated_at: new Date() };

    await redisClient.set(cacheKey, JSON.stringify(updatedStatus));
    
    await publishEvent(TOPICS.DRIVER_STATUS_UPDATED, updatedStatus);

    return updatedStatus;
  }

  public async getStatus(driverId: string): Promise<DriverStatusDto | null> {
    const cacheKey = `driver_status:${driverId}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as DriverStatusDto;
    }

    return null;
  }
}

export const driverService = new DriverService();
