import { v4 as uuidv4 } from 'uuid';
import { cassandraClient } from '../config/cassandra';
import { IPayment } from '../interfaces/payment.interface';

export class PaymentRepository {
  async create(data: { bookingId: string; userId: string; amount: number; currency: string; status: string }): Promise<IPayment> {
    const id = uuidv4();
    const query = `
      INSERT INTO payment.payments (id, booking_id, user_id, amount, currency, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    
    await cassandraClient.execute(query, [id, data.bookingId, data.userId, data.amount, data.currency, data.status], { prepare: true });
    return this.findById(id) as Promise<IPayment>;
  }

  async findById(id: string): Promise<IPayment | null> {
    const query = `SELECT * FROM payment.payments WHERE id = ?`;
    const result = await cassandraClient.execute(query, [id], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as IPayment;
  }

  async findByBookingId(bookingId: string): Promise<IPayment | null> {
    const query = `SELECT * FROM payment.payments WHERE booking_id = ?`;
    const result = await cassandraClient.execute(query, [bookingId], { prepare: true });
    
    if (result.rowLength === 0) return null;
    return result.first() as any as IPayment;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const query = `
      UPDATE payment.payments 
      SET status = ?, updated_at = toTimestamp(now()) 
      WHERE id = ?
    `;
    await cassandraClient.execute(query, [status, id], { prepare: true });
  }

  async insertTransactionHistory(paymentId: string, status: string, details: string): Promise<void> {
    const query = `
      INSERT INTO payment.transaction_history (payment_id, status, details, created_at)
      VALUES (?, ?, ?, toTimestamp(now()))
    `;
    await cassandraClient.execute(query, [paymentId, status, details], { prepare: true });
  }
}

export const paymentRepository = new PaymentRepository();
