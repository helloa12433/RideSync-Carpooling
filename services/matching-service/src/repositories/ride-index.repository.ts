import { redisClient } from '../config/redis';
import { logger } from '../config/logger';

export interface IndexedRide {
  id: string;
  driver_id: string;
  vehicle_id: string;
  source_location: string;
  source_lat: number;
  source_lng: number;
  destination_location: string;
  destination_lat: number;
  destination_lng: number;
  departure_time: string | Date;
  estimated_arrival_time: string | Date;
  total_seats: number;
  available_seats: number;
  price_per_seat: number;
  status: string;
}

export class RideIndexRepository {
  private readonly PREFIX = 'indexed_ride:';

  public async indexRide(ride: IndexedRide): Promise<void> {
    const key = `${this.PREFIX}${ride.id}`;
    await redisClient.setex(key, 86400 * 7, JSON.stringify(ride)); // Keep in index for 7 days
    logger.info(`Ride ${ride.id} indexed successfully`);
  }

  public async updateRideStatus(rideId: string, status: string): Promise<void> {
    const key = `${this.PREFIX}${rideId}`;
    const data = await redisClient.get(key);
    if (data) {
      const ride = JSON.parse(data) as IndexedRide;
      ride.status = status;
      await redisClient.setex(key, 86400 * 7, JSON.stringify(ride));
      logger.info(`Indexed ride ${rideId} status updated to ${status}`);
    }
  }

  public async searchRides(source: string, destination: string, date: string, passengers: number): Promise<IndexedRide[]> {
    const keys = await redisClient.keys(`${this.PREFIX}*`);
    if (!keys || keys.length === 0) return [];

    const ridesData = await redisClient.mget(keys);
    const rides: IndexedRide[] = ridesData
      .filter((data): data is string => data !== null)
      .map(data => JSON.parse(data));

    return rides.filter(ride => {
      if (ride.status !== 'PUBLISHED') return false;
      if (ride.available_seats < passengers) return false;
      
      const rideDate = new Date(ride.departure_time).toISOString().split('T')[0];
      if (rideDate !== date) return false;
      
      const sourceMatch = ride.source_location.toLowerCase().includes(source.toLowerCase()) || source.toLowerCase().includes(ride.source_location.toLowerCase());
      const destMatch = ride.destination_location.toLowerCase().includes(destination.toLowerCase()) || destination.toLowerCase().includes(ride.destination_location.toLowerCase());
      
      return sourceMatch && destMatch;
    }).sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
  }
}

export const rideIndexRepository = new RideIndexRepository();
