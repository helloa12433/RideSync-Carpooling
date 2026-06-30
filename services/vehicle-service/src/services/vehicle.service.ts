import { vehicleRepository } from '../repositories/vehicle.repository';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { IVehicle } from '../interfaces/vehicle.interface';
import { redisClient } from '../config/redis';
import { publishEvent } from '../events/producer';
import { TOPICS } from '../utils/constants';

class VehicleService {
  public async createProfile(vehicleData: CreateVehicleDto): Promise<IVehicle> {

    const vehicle = await vehicleRepository.create(vehicleData);

    await publishEvent(TOPICS.VEHICLE_CREATED, { id: vehicle.id, driver_id: vehicle.driver_id });

    return vehicle;
  }

  public async getDriverVehicles(driverId: string): Promise<IVehicle[]> {
    return vehicleRepository.findByDriverId(driverId);
  }

  public async getProfile(id: string): Promise<IVehicle | null> {
    const cacheKey = `vehicle_profile:${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as IVehicle;
    }

    const vehicle = await vehicleRepository.findById(id);

    if (vehicle) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(vehicle));
    }

    return vehicle;
  }

  public async updateProfile(id: string, updateData: UpdateVehicleDto): Promise<IVehicle | null> {
    const updatedVehicle = await vehicleRepository.update(id, updateData);

    if (updatedVehicle) {
      await redisClient.del(`vehicle_profile:${id}`);
      if (updateData.status) {
        await publishEvent(TOPICS.VEHICLE_STATUS_UPDATED, { 
          id: updatedVehicle.id, 
          status: updatedVehicle.status 
        });
      }
    }

    return updatedVehicle;
  }
}

export const vehicleService = new VehicleService();
