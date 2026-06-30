"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectCassandra = exports.cassandraClient = void 0;
const cassandra_driver_1 = require("cassandra-driver");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.cassandraClient = new cassandra_driver_1.Client({
    contactPoints: env_1.env.cassandra.contactPoints,
    localDataCenter: env_1.env.cassandra.localDataCenter,
    keyspace: env_1.env.cassandra.keyspace,
});
const connectCassandra = async () => {
    try {
        const initClient = new cassandra_driver_1.Client({
            contactPoints: env_1.env.cassandra.contactPoints,
            localDataCenter: env_1.env.cassandra.localDataCenter,
        });
        await initClient.connect();
        await initClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${env_1.env.cassandra.keyspace} 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    `);
        await initClient.execute(`USE ${env_1.env.cassandra.keyspace}`);
        await initClient.execute(`
      CREATE TABLE IF NOT EXISTS autoshift_history (
        id uuid PRIMARY KEY,
        ride_id text,
        old_driver_id text,
        new_driver_id text,
        reason text,
        type text,
        status text,
        created_at timestamp,
        completed_at timestamp
      );
    `);
        await initClient.execute(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS autoshift_history_by_ride AS
      SELECT * FROM autoshift_history
      WHERE ride_id IS NOT NULL AND id IS NOT NULL
      PRIMARY KEY (ride_id, id);
    `);
        await initClient.shutdown();
        await exports.cassandraClient.connect();
        logger_1.logger.info('Connected to Cassandra successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Cassandra', error);
        process.exit(1);
    }
};
exports.connectCassandra = connectCassandra;
