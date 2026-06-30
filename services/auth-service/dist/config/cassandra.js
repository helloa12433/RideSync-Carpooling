"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectCassandra = void 0;
const cassandra_driver_1 = require("cassandra-driver");
const cassandraClient = new cassandra_driver_1.Client({
    contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'localhost'],
    localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
    keyspace: process.env.CASSANDRA_KEYSPACE || 'carpool',
});
const connectCassandra = async () => {
    try {
        // First, connect without keyspace to create it if it doesn't exist
        const initClient = new cassandra_driver_1.Client({
            contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'localhost'],
            localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
        });
        await initClient.connect();
        await initClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS carpool 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    `);
        await initClient.shutdown();
        // Now connect with the keyspace
        await cassandraClient.connect();
        console.log('Connected to Cassandra successfully');
        await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        email text,
        first_name text,
        last_name text,
        profile_picture text,
        role text,
        created_at timestamp,
        updated_at timestamp
      );
    `);
        console.log('Cassandra users table ready');
    }
    catch (error) {
        console.error('Cassandra connection failed', error);
        process.exit(1);
    }
};
exports.connectCassandra = connectCassandra;
exports.default = cassandraClient;
