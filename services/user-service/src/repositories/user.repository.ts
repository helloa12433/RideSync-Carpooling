import { cassandraClient } from '../config/cassandra';
import { IUser } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  public async createWithId(id: string, userData: CreateUserDto): Promise<IUser> {
    const now = new Date();
    const role = userData.role || 'USER';

    const query = `
      INSERT INTO user_profiles (id, email, password_hash, first_name, last_name, phone_number, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      userData.email,
      userData.password_hash || '',
      userData.first_name,
      userData.last_name,
      userData.phone_number || null,
      role,
      now,
      now,
    ];

    await cassandraClient.execute(query, params, { prepare: true });
    console.log('[UserRepository] user_profiles record created with auth ID:', id);

    return {
      id,
      email: userData.email,
      password_hash: userData.password_hash || '',
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number || undefined,
      role,
      created_at: now,
      updated_at: now,
    };
  }

  public async create(userData: CreateUserDto): Promise<IUser> {
    const id = uuidv4();
    const now = new Date();
    const role = userData.role || 'RIDER';

    const query = `
      INSERT INTO user_profiles (id, email, password_hash, first_name, last_name, phone_number, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
      userData.phone_number || null,
      role,
      now,
      now,
    ];

    await cassandraClient.execute(query, params, { prepare: true });

    return {
      id,
      email: userData.email,
      password_hash: userData.password_hash,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number || undefined,
      role,
      created_at: now,
      updated_at: now,
    };
  }

  public async findById(id: string): Promise<IUser | null> {
    const query = 'SELECT * FROM user_profiles WHERE id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) {
      return null;
    }

    const row = result.first();
    return {
      id: row.id.toString(),
      email: row.email,
      password_hash: row.password_hash,
      first_name: row.first_name,
      last_name: row.last_name,
      phone_number: row.phone_number,
      country_code: row.country_code,
      role: row.role,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM user_profiles WHERE email = ? ALLOW FILTERING';
    const result = await cassandraClient.execute(query, [email], { prepare: true });

    if (result.rowLength === 0) {
      return null;
    }

    const row = result.first();
    return {
      id: row.id.toString(),
      email: row.email,
      password_hash: row.password_hash,
      first_name: row.first_name,
      last_name: row.last_name,
      phone_number: row.phone_number,
      country_code: row.country_code,
      role: row.role,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  public async update(id: string, updateData: UpdateUserDto): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updateData, updated_at: new Date() };

    const query = `
      UPDATE user_profiles SET first_name = ?, last_name = ?, phone_number = ?, country_code = ?, updated_at = ?
      WHERE id = ?
    `;
    const params = [
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.phone_number || null,
      updatedUser.country_code || null,
      updatedUser.updated_at,
      id,
    ];

    try {
      console.log('\n[UserRepository] Executing UPDATE Query:');
      console.log(query.trim());
      console.log('[UserRepository] Parameters:', JSON.stringify(params));
      
      const result = await cassandraClient.execute(query, params, { prepare: true });
      
      console.log('[UserRepository] Cassandra Update Successful');
      console.log(`[UserRepository] Cassandra Response:`, result.info);
    } catch (error: any) {
      console.error('[UserRepository] Cassandra Update Failed:', error.message);
      throw error;
    }

    return updatedUser;
  }
}

export const userRepository = new UserRepository();
