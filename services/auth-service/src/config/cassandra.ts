import { Client } from 'cassandra-driver';

const cassandraClient = new Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'localhost'],
  localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'carpool',
});

export const connectCassandra = async () => {
  try {
    // First, connect without keyspace to create it if it doesn't exist
    const initClient = new Client({
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
    console.log('[AuthService] Connected to Cassandra successfully');

    // accounts table: canonical identity store (Google SSO users)
    await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id uuid PRIMARY KEY,
        email text,
        google_id text,
        first_name text,
        last_name text,
        profile_picture text,
        role text,
        created_at timestamp,
        updated_at timestamp
      );
    `);

    await cassandraClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts (email);
    `);

    // Legacy users table kept for backwards compat (other services may read it)
    await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        email text,
        first_name text,
        last_name text,
        phone_number text,
        country_code text,
        profile_picture text,
        role text,
        created_at timestamp,
        updated_at timestamp
      );
    `);

    console.log('[AuthService] Cassandra accounts table ready');
    console.log('[AuthService] Cassandra users table ready (legacy compat)');
  } catch (error) {
    console.error('[AuthService] Cassandra connection failed', error);
    process.exit(1);
  }
};

export default cassandraClient;
