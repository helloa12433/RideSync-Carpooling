import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IMatching } from '../interfaces/matching.interface';
import { MATCHING_STATUS } from '../utils/constants';

export class MatchingRepository {
  async create(rideId: string): Promise<IMatching> {
    const id = uuidv4();
    const query = `
      INSERT INTO matching.matchings (id, ride_id, status, created_at, updated_at)
      VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    
    const params = [id, rideId, MATCHING_STATUS.PENDING];
    await cassandraClient.execute(query, params, { prepare: true });
    
    return this.findById(id) as Promise<IMatching>;
  }

  async findById(id: string): Promise<IMatching | null> {
    const query = `SELECT * FROM matching.matchings WHERE id = ?`;
    const result = await cassandraClient.execute(query, [id], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as IMatching;
  }

  async findByRideId(rideId: string): Promise<IMatching | null> {
    const query = `SELECT * FROM matching.matchings WHERE ride_id = ?`;
    const result = await cassandraClient.execute(query, [rideId], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as IMatching;
  }

  async updateStatusAndDriver(id: string, status: string, driverId?: string): Promise<void> {
    let query = `UPDATE matching.matchings SET status = ?, updated_at = toTimestamp(now())`;
    const params: any[] = [status];

    if (driverId) {
      query += `, assigned_driver_id = ?`;
      params.push(driverId);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await cassandraClient.execute(query, params, { prepare: true });
  }
}

export const matchingRepository = new MatchingRepository();
