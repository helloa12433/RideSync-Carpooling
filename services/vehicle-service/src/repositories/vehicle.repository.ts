import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IVehicle } from '../interfaces/vehicle.interface';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VEHICLE_STATUS } from '../utils/constants';

class VehicleRepository {
  public async create(data: CreateVehicleDto): Promise<IVehicle> {
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();
    const status = VEHICLE_STATUS.INACTIVE;

    const query = `
      INSERT INTO vehicles (id, driver_id, make, model, year, license_plate, capacity, color, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id, data.driver_id, data.make, data.model, data.year, data.license_plate, data.capacity, data.color, status, created_at, updated_at
    ];

    await cassandraClient.execute(query, params, { prepare: true });

    return {
      id,
      ...data,
      status,
      created_at,
      updated_at,
    };
  }

  public async findById(id: string): Promise<IVehicle | null> {
    const query = 'SELECT * FROM vehicles WHERE id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) {
      return null;
    }

    return result.first() as unknown as IVehicle;
  }

  public async findByDriverId(driver_id: string): Promise<IVehicle[]> {
    const query = 'SELECT * FROM vehicles WHERE driver_id = ? ALLOW FILTERING';
    const result = await cassandraClient.execute(query, [driver_id], { prepare: true });

    return result.rows as unknown as IVehicle[];
  }

  public async update(id: string, data: UpdateVehicleDto): Promise<IVehicle | null> {
    const vehicle = await this.findById(id);
    if (!vehicle) return null;

    const updated_at = new Date();
    const updateFields: string[] = [];
    const params: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    });

    updateFields.push('updated_at = ?');
    params.push(updated_at);
    params.push(id);

    const query = `UPDATE vehicles SET ${updateFields.join(', ')} WHERE id = ?`;

    await cassandraClient.execute(query, params, { prepare: true });

    return {
      ...vehicle,
      ...data,
      updated_at,
    };
  }
}

export const vehicleRepository = new VehicleRepository();
