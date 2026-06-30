import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { ITracking } from '../interfaces/tracking.interface';

export class TrackingRepository {
  async create(rideId: string): Promise<ITracking> {
    const id = uuidv4();
    const query = `
      INSERT INTO tracking.trip_history (id, ride_id, status, started_at)
      VALUES (?, ?, ?, toTimestamp(now()))
    `;
    
    await cassandraClient.execute(query, [id, rideId, 'STARTED'], { prepare: true });
    return this.findByRideId(rideId) as Promise<ITracking>;
  }

  async findByRideId(rideId: string): Promise<ITracking | null> {
    const query = `SELECT * FROM tracking.trip_history WHERE ride_id = ?`;
    const result = await cassandraClient.execute(query, [rideId], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as ITracking;
  }

  async updateStatusAndRoute(rideId: string, status: string, route: string, distanceKm: number): Promise<void> {
    // Note: Cassandra update by ride_id implies it's a primary key or we use materialized views.
    // For simplicity, assuming trip_history table uses ride_id as partition key in this specific query logic.
    const query = `
      UPDATE tracking.trip_history 
      SET status = ?, route = ?, distance_km = ?, completed_at = toTimestamp(now()) 
      WHERE ride_id = ?
    `;
    await cassandraClient.execute(query, [status, route, distanceKm, rideId], { prepare: true });
  }
}

export const trackingRepository = new TrackingRepository();
