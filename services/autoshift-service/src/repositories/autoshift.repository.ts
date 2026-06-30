import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IAutoshift } from '../interfaces/autoshift.interface';
import { logger } from '../config/logger';

export class AutoshiftRepository {
  async create(data: {
    rideId: string;
    oldDriverId: string;
    reason: string;
    type: string;
    status: string;
  }): Promise<IAutoshift> {
    const id = uuidv4();
    const query = `
      INSERT INTO autoshift.autoshift_history (id, ride_id, old_driver_id, reason, type, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))
    `;

    await cassandraClient.execute(
      query,
      [id, data.rideId, data.oldDriverId, data.reason, data.type, data.status],
      { prepare: true }
    );

    logger.info(`AutoShift record ${id} created for ride ${data.rideId}`);
    return this.findById(id) as Promise<IAutoshift>;
  }

  async findById(id: string): Promise<IAutoshift | null> {
    const query = `SELECT * FROM autoshift.autoshift_history WHERE id = ?`;
    const result = await cassandraClient.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) return null;
    return result.first() as any as IAutoshift;
  }

  async findByRideId(rideId: string): Promise<IAutoshift[]> {
    const query = `SELECT * FROM autoshift.autoshift_history WHERE ride_id = ?`;
    const result = await cassandraClient.execute(query, [rideId], { prepare: true });
    return result.rows as any as IAutoshift[];
  }

  async updateStatus(id: string, status: string, newDriverId?: string): Promise<void> {
    const query = newDriverId
      ? `UPDATE autoshift.autoshift_history SET status = ?, new_driver_id = ?, completed_at = toTimestamp(now()) WHERE id = ?`
      : `UPDATE autoshift.autoshift_history SET status = ?, completed_at = toTimestamp(now()) WHERE id = ?`;

    const params = newDriverId ? [status, newDriverId, id] : [status, id];
    await cassandraClient.execute(query, params, { prepare: true });
  }
}

export const autoshiftRepository = new AutoshiftRepository();
