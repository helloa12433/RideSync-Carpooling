"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const cassandra_1 = __importDefault(require("../config/cassandra"));
const redis_1 = __importDefault(require("../config/redis"));
const cassandra_driver_1 = require("cassandra-driver");
class AuthRepository {
    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? ALLOW FILTERING';
        const result = await cassandra_1.default.execute(query, [email], { prepare: true });
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async getUserById(userId) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const result = await cassandra_1.default.execute(query, [userId], { prepare: true });
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async updateRole(userId, role) {
        const query = 'UPDATE users SET role = ? WHERE id = ?';
        await cassandra_1.default.execute(query, [role, userId], { prepare: true });
    }
    async createUser(user) {
        const id = cassandra_driver_1.types.Uuid.random().toString();
        const created_at = new Date();
        // Using the same columns as user-service to prevent schema mismatch
        const query = `
      INSERT INTO users (id, email, first_name, last_name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        await cassandra_1.default.execute(query, [id, user.email, user.first_name, user.last_name, user.role, created_at, created_at], { prepare: true });
        return { ...user, id, created_at };
    }
    async storeRefreshToken(userId, token, expiresInSeconds) {
        await redis_1.default.set(`refresh_token:${userId}`, token, 'EX', expiresInSeconds);
    }
    async getRefreshToken(userId) {
        return redis_1.default.get(`refresh_token:${userId}`);
    }
    async deleteRefreshToken(userId) {
        await redis_1.default.del(`refresh_token:${userId}`);
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
