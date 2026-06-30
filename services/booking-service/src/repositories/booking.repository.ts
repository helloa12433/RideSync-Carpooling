import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IBooking } from '../interfaces/booking.interface';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BOOKING_STATUS } from '../utils/constants';

export class BookingRepository {
  async create(data: CreateBookingDto): Promise<IBooking> {
    const id = uuidv4();
    const query = `
      INSERT INTO booking.bookings (id, ride_id, user_id, status, seats, total_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    
    const params = [
      id,
      data.rideId,
      data.userId,
      BOOKING_STATUS.PENDING,
      data.seats,
      data.totalPrice
    ];

    await cassandraClient.execute(query, params, { prepare: true });
    
    return this.findById(id) as Promise<IBooking>;
  }

  async findById(id: string): Promise<IBooking | null> {
    const query = `SELECT * FROM booking.bookings WHERE id = ?`;
    const result = await cassandraClient.execute(query, [id], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as IBooking;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const query = `
      UPDATE booking.bookings 
      SET status = ?, updated_at = toTimestamp(now()) 
      WHERE id = ?
    `;
    await cassandraClient.execute(query, [status, id], { prepare: true });
  }

  async findByUserId(userId: string): Promise<IBooking[]> {
    // Note: We use a secondary index on user_id in Cassandra
    const query = `SELECT * FROM booking.bookings WHERE user_id = ?`;
    const result = await cassandraClient.execute(query, [userId], { prepare: true });
    return result.rows as any[] as IBooking[];
  }

  async findByRideId(rideId: string): Promise<IBooking[]> {
    const query = `SELECT * FROM booking.bookings WHERE ride_id = ? ALLOW FILTERING`;
    const result = await cassandraClient.execute(query, [rideId], { prepare: true });
    return result.rows as any[] as IBooking[];
  }
}

export const bookingRepository = new BookingRepository();
