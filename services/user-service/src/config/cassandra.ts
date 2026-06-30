import { Client } from 'cassandra-driver';
import { env } from './env';
import { logger } from './logger';

export const cassandraClient = new Client({
  contactPoints: env.CASSANDRA_CONTACT_POINTS,
  localDataCenter: env.CASSANDRA_LOCAL_DATACENTER,
  keyspace: env.CASSANDRA_KEYSPACE,
});

export const connectCassandra = async (): Promise<void> => {
  try {
    await cassandraClient.connect();
    logger.info('Connected to Cassandra successfully');

    await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
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
    logger.info('Cassandra user_profiles table ready');
  } catch (error) {
    logger.error('Failed to connect to Cassandra', { error });
    process.exit(1);
  }
};
