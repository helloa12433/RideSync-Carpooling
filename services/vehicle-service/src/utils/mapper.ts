import { IVehicle } from '../interfaces/vehicle.interface';
import { VehicleProfileDto } from '../dto/vehicle-profile.dto';

export const toVehicleProfileDto = (vehicle: IVehicle): VehicleProfileDto => {
  return {
    id: vehicle.id,
    driver_id: vehicle.driver_id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    license_plate: vehicle.license_plate,
    capacity: vehicle.capacity,
    color: vehicle.color,
    status: vehicle.status,
    created_at: vehicle.created_at,
    updated_at: vehicle.updated_at,
  };
};
