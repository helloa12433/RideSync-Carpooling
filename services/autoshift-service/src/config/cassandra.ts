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
      CREATE INDEX IF NOT EXISTS autoshift_history_ride_id_idx 
      ON autoshift_history (ride_id);
    `);
    
    await initClient.shutdown();

    await cassandraClient.connect();
    logger.info('Connected to Cassandra successfully');
  } catch (error) {
    logger.error('Failed to connect to Cassandra', error);
    process.exit(1);
  }
};
