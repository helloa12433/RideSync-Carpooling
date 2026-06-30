import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IRide } from '../interfaces/ride.interface';
import { CreateRideDto } from '../dto/create-ride.dto';
import { UpdateRideDto } from '../dto/update-ride.dto';
import { RIDE_STATUS } from '../utils/constants';

type CreateRideInput = CreateRideDto & {
  distance: number;
  estimated_arrival_time: Date;
};

type UpdateableRideFields = Pick<
  UpdateRideDto,
  'departure_time' | 'total_seats' | 'price_per_seat' | 'visibility'
>;

const UPDATABLE_FIELDS: ReadonlyArray<keyof UpdateableRideFields> = [
  'departure_time',
  'total_seats',
  'price_per_seat',
  'visibility',
];

function rowToRide(row: Record<string, unknown>): IRide {
  return {
    id: row['id'] as string,
    driver_id: row['driver_id'] as string,
    vehicle_id: row['vehicle_id'] as string,
    source_location: row['source_location'] as string,
    source_lat: row['source_lat'] as number,
    source_lng: row['source_lng'] as number,
    destination_location: row['destination_location'] as string,
    destination_lat: row['destination_lat'] as number,
    destination_lng: row['destination_lng'] as number,
    distance: row['distance'] as number,
    departure_time: row['departure_time'] as Date,
    estimated_arrival_time: row['estimated_arrival_time'] as Date,
    total_seats: row['total_seats'] as number,
    available_seats: row['available_seats'] as number,
    price_per_seat: row['price_per_seat'] as number,
    status: row['status'] as string,
    visibility: row['visibility'] as string,
    offered_seats: row['offered_seats'] as string[],
    available_seats_list: row['available_seats_list'] as string[],
    created_at: row['created_at'] as Date,
    updated_at: row['updated_at'] as Date,
  };
}

class RideRepository {
  public async create(data: CreateRideInput): Promise<IRide> {
    const id = uuidv4();
    const now = new Date();
    const status = RIDE_STATUS.DRAFT;
    const visibility = 'PUBLIC';
    const available_seats = data.total_seats;
    const offered_seats = data.offered_seats || [];
    const available_seats_list = [...offered_seats];

    const query = `
      INSERT INTO rides (
        id, driver_id, vehicle_id,
        source_location, source_lat, source_lng,
        destination_location, destination_lat, destination_lng,
        distance, departure_time, estimated_arrival_time,
        total_seats, available_seats, price_per_seat,
        status, visibility, offered_seats, available_seats_list, created_at, updated_at
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `;

    const params = [
      id, data.driver_id, data.vehicle_id,
      data.source_location, data.source_lat, data.source_lng,
      data.destination_location, data.destination_lat, data.destination_lng,
      data.distance, data.departure_time, data.estimated_arrival_time,
      data.total_seats, available_seats, data.price_per_seat,
      status, visibility, offered_seats, available_seats_list, now, now,
    ];

    await cassandraClient.execute(query, params, { prepare: true });

    return {
      id,
      driver_id: data.driver_id,
      vehicle_id: data.vehicle_id,
      source_location: data.source_location,
      source_lat: data.source_lat,
      source_lng: data.source_lng,
      destination_location: data.destination_location,
      destination_lat: data.destination_lat,
      destination_lng: data.destination_lng,
      distance: data.distance,
      departure_time: data.departure_time,
      estimated_arrival_time: data.estimated_arrival_time,
      total_seats: data.total_seats,
      available_seats,
      price_per_seat: data.price_per_seat,
      status,
      visibility,
      offered_seats,
      available_seats_list,
      created_at: now,
      updated_at: now,
    };
  }

  public async findById(id: string): Promise<IRide | null> {
    const query = 'SELECT * FROM rides WHERE id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) return null;

    return rowToRide(result.first() as Record<string, unknown>);
  }

  public async findByDriverId(driverId: string): Promise<IRide[]> {
    const query = 'SELECT * FROM rides_by_driver WHERE driver_id = ?';
    const result = await cassandraClient.execute(query, [driverId], { prepare: true });

    return result.rows.map((row) => rowToRide(row as Record<string, unknown>));
  }

  public async searchRides(source: string, destination: string): Promise<IRide[]> {
    const query = `
      SELECT * FROM rides 
      WHERE source_location = ? AND destination_location = ? AND status = ? 
      ALLOW FILTERING
    `;
    const result = await cassandraClient.execute(query, [source, destination, RIDE_STATUS.PUBLISHED], { prepare: true });
    return result.rows.map((row) => rowToRide(row as Record<string, unknown>));
  }

  public async findPublishedRide(id: string): Promise<IRide | null> {
    const ride = await this.findById(id);

    if (!ride || ride.status !== RIDE_STATUS.PUBLISHED) return null;

    return ride;
  }

  public async update(id: string, data: UpdateRideDto): Promise<IRide | null> {
    const ride = await this.findById(id);
    if (!ride) return null;

    const setClauses: string[] = [];
    const params: unknown[] = [];

    for (const field of UPDATABLE_FIELDS) {
      if (data[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (setClauses.length === 0) return ride;

    const updated_at = new Date();
    setClauses.push('updated_at = ?');
    params.push(updated_at);
    params.push(id);

    const query = `UPDATE rides SET ${setClauses.join(', ')} WHERE id = ?`;
    await cassandraClient.execute(query, params, { prepare: true });

    return {
      ...ride,
      ...data,
      updated_at,
    };
  }

  public async updateRideStatus(id: string, status: string): Promise<IRide | null> {
    const ride = await this.findById(id);
    if (!ride) return null;

    const updated_at = new Date();
    const query = 'UPDATE rides SET status = ?, updated_at = ? WHERE id = ?';
    await cassandraClient.execute(query, [status, updated_at, id], { prepare: true });

    return { ...ride, status, updated_at };
  }

  public async updateAvailableSeats(id: string, availableSeats: number): Promise<IRide | null> {
    const ride = await this.findById(id);
    if (!ride) return null;

    const updated_at = new Date();
    const query = 'UPDATE rides SET available_seats = ?, updated_at = ? WHERE id = ?';
    await cassandraClient.execute(query, [availableSeats, updated_at, id], { prepare: true });

    return { ...ride, available_seats: availableSeats, updated_at };
  }

  public async deleteRide(id: string): Promise<boolean> {
    const ride = await this.findById(id);
    if (!ride) return false;

    const query = 'DELETE FROM rides WHERE id = ?';
    await cassandraClient.execute(query, [id], { prepare: true });

    return true;
  }
}

export const rideRepository = new RideRepository();
