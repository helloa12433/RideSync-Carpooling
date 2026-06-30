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
  } catch (error) {
    logger.error('Failed to connect to Cassandra', { error });
    process.exit(1);
  }
};
