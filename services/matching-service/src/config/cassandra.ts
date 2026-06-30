import { Client } from 'cassandra-driver';
import { env } from './env';
import { logger } from './logger';

export const cassandraClient = new Client({
  contactPoints: env.cassandra.contactPoints,
  localDataCenter: env.cassandra.localDataCenter,
  keyspace: env.cassandra.keyspace,
});

export const connectCassandra = async (): Promise<void> => {
  try {
    const initClient = new Client({
      contactPoints: env.cassandra.contactPoints,
      localDataCenter: env.cassandra.localDataCenter,
    });
    
    await initClient.connect();
    
    await initClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${env.cassandra.keyspace} 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    `);
    
    await initClient.execute(`USE ${env.cassandra.keyspace}`);
    
    await initClient.execute(`
      CREATE TABLE IF NOT EXISTS matchings (
        id uuid PRIMARY KEY,
        ride_id uuid,
        assigned_driver_id uuid,
        status text,
        created_at timestamp,
        updated_at timestamp
      );
    `);
    
    await initClient.execute(`
      CREATE INDEX IF NOT EXISTS matchings_ride_id_idx ON matchings (ride_id);
    `);
    
    await initClient.shutdown();

    await cassandraClient.connect();
    logger.info('Connected to Cassandra successfully');
  } catch (error) {
    logger.error('Failed to connect to Cassandra', error);
    process.exit(1);
  }
};
