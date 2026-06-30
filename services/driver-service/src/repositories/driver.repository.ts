import { cassandraClient } from '../config/cassandra';
import { IDriver } from '../interfaces/driver.interface';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { v4 as uuidv4 } from 'uuid';

export class DriverRepository {
  public async create(driverData: CreateDriverDto): Promise<IDriver> {
    const id = uuidv4();
    const now = new Date();
    
    const query = `
      INSERT INTO driver_profiles (id, user_id, email, first_name, last_name, profile_picture, license_number, rating, total_rides, verification_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      driverData.user_id,
      driverData.email || '',
      driverData.first_name || '',
      driverData.last_name || '',
      driverData.profile_picture || '',
      driverData.license_number || '',
      0,
      0,
      'PENDING',
      now,
      now,
    ];

    await cassandraClient.execute(query, params, { prepare: true });

    return {
      id,
      user_id: driverData.user_id,
      email: driverData.email,
      first_name: driverData.first_name,
      last_name: driverData.last_name,
      profile_picture: driverData.profile_picture,
      license_number: driverData.license_number,
      rating: 0,
      total_rides: 0,
      verification_status: 'PENDING',
      created_at: now,
      updated_at: now,
    };
  }

  public async findById(id: string): Promise<IDriver | null> {
    const query = 'SELECT * FROM driver_profiles WHERE id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) {
      return null;
    }

    const row = result.first();
    return {
      id: row.id.toString(),
      user_id: row.user_id.toString(),
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      phone_number: row.phone_number,
      country_code: row.country_code,
      profile_picture: row.profile_picture,
      license_number: row.license_number,
      rating: row.rating,
      total_rides: row.total_rides,
      verification_status: row.verification_status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  public async findByUserId(user_id: string): Promise<IDriver | null> {
    const query = 'SELECT * FROM driver_profiles WHERE user_id = ?';
    const result = await cassandraClient.execute(query, [user_id], { prepare: true });

    if (result.rowLength === 0) {
      return null;
    }

    const row = result.first();
    return {
      id: row.id.toString(),
      user_id: row.user_id.toString(),
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      phone_number: row.phone_number,
      country_code: row.country_code,
      profile_picture: row.profile_picture,
      license_number: row.license_number,
      rating: row.rating,
      total_rides: row.total_rides,
      verification_status: row.verification_status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  public async update(id: string, updateData: UpdateDriverDto): Promise<IDriver | null> {
    const driver = await this.findById(id);
    if (!driver) return null;

    const updatedDriver = { ...driver, ...updateData, updated_at: new Date() };

    const query = `
      UPDATE driver_profiles SET first_name = ?, last_name = ?, phone_number = ?, country_code = ?, profile_picture = ?, license_number = ?, verification_status = ?, updated_at = ?
      WHERE id = ?
    `;
    const params = [
      updatedDriver.first_name || null,
      updatedDriver.last_name || null,
      updatedDriver.phone_number || null,
      updatedDriver.country_code || null,
      updatedDriver.profile_picture || null,
      updatedDriver.license_number || null,
      updatedDriver.verification_status,
      updatedDriver.updated_at,
      id,
    ];

    try {
      console.log('\\n[DriverRepository] Executing UPDATE Query:', query.trim());
      await cassandraClient.execute(query, params, { prepare: true });
      console.log('[DriverRepository] Cassandra Update Successful');
    } catch (error: any) {
      console.error('[DriverRepository] Cassandra Update Failed:', error.message);
      throw error;
    }

    return updatedDriver;
  }
}

export const driverRepository = new DriverRepository();
