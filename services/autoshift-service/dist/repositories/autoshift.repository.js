"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoshiftRepository = exports.AutoshiftRepository = void 0;
const uuid_1 = require("uuid");
const cassandra_1 = require("../config/cassandra");
const logger_1 = require("../config/logger");
class AutoshiftRepository {
    async create(data) {
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO autoshift.autoshift_history (id, ride_id, old_driver_id, reason, type, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))
    `;
        await cassandra_1.cassandraClient.execute(query, [id, data.rideId, data.oldDriverId, data.reason, data.type, data.status], { prepare: true });
        logger_1.logger.info(`AutoShift record ${id} created for ride ${data.rideId}`);
        return this.findById(id);
    }
    async findById(id) {
        const query = `SELECT * FROM autoshift.autoshift_history WHERE id = ?`;
        const result = await cassandra_1.cassandraClient.execute(query, [id], { prepare: true });
        if (result.rowLength === 0)
            return null;
        return result.first();
    }
    async findByRideId(rideId) {
        const query = `SELECT * FROM autoshift.autoshift_history_by_ride WHERE ride_id = ?`;
        const result = await cassandra_1.cassandraClient.execute(query, [rideId], { prepare: true });
        return result.rows;
    }
    async updateStatus(id, status, newDriverId) {
        const query = newDriverId
            ? `UPDATE autoshift.autoshift_history SET status = ?, new_driver_id = ?, completed_at = toTimestamp(now()) WHERE id = ?`
            : `UPDATE autoshift.autoshift_history SET status = ?, completed_at = toTimestamp(now()) WHERE id = ?`;
        const params = newDriverId ? [status, newDriverId, id] : [status, id];
        await cassandra_1.cassandraClient.execute(query, params, { prepare: true });
    }
}
exports.AutoshiftRepository = AutoshiftRepository;
exports.autoshiftRepository = new AutoshiftRepository();
