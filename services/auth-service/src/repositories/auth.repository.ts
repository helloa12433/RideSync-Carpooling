import cassandraClient from '../config/cassandra';
import redisClient from '../config/redis';
import { types } from 'cassandra-driver';

export interface AccountDTO {
  id?: string;
  email: string;
  google_id?: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  role: string;
}

export class AuthRepository {
  // ─── accounts table (canonical identity) ───────────────────────────────────

  async getAccountByEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM accounts WHERE email = ? ALLOW FILTERING';
    const result = await cassandraClient.execute(query, [email], { prepare: true });
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getAccountById(id: string): Promise<any> {
    const query = 'SELECT * FROM accounts WHERE id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createAccount(account: AccountDTO): Promise<any> {
    const id = types.Uuid.random().toString();
    const now = new Date();

    const query = `
      INSERT INTO accounts (id, email, google_id, first_name, last_name, profile_picture, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await cassandraClient.execute(
      query,
      [id, account.email, account.google_id || '', account.first_name, account.last_name, account.profile_picture || '', account.role, now, now],
      { prepare: true }
    );

    return { ...account, id, created_at: now, updated_at: now };
  }

  async updateRole(accountId: string, role: string): Promise<void> {
    const now = new Date();
    const query = 'UPDATE accounts SET role = ?, updated_at = ? WHERE id = ?';
    await cassandraClient.execute(query, [role, now, accountId], { prepare: true });
  }

  // ─── Legacy: getUserByEmail / getUserById read from accounts ───────────────
  // Kept for backward compat with existing code calling getUserByEmail/getUserById

  async getUserByEmail(email: string): Promise<any> {
    return this.getAccountByEmail(email);
  }

  async getUserById(userId: string): Promise<any> {
    return this.getAccountById(userId);
  }

  async createUser(user: AccountDTO): Promise<any> {
    return this.createAccount(user);
  }

  // ─── Redis token management ────────────────────────────────────────────────

  async storeRefreshToken(userId: string, token: string, expiresInSeconds: number): Promise<void> {
    await redisClient.set(`refresh_token:${userId}`, token, 'EX', expiresInSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return redisClient.get(`refresh_token:${userId}`);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await redisClient.del(`refresh_token:${userId}`);
  }
}

export const authRepository = new AuthRepository();
