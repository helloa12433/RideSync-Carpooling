import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3004', 10),
  CASSANDRA_CONTACT_POINTS: process.env.CASSANDRA_CONTACT_POINTS ? process.env.CASSANDRA_CONTACT_POINTS.split(',') : ['127.0.0.1'],
  CASSANDRA_LOCAL_DATACENTER: process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1',
  CASSANDRA_KEYSPACE: process.env.CASSANDRA_KEYSPACE || 'driver_keyspace',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  KAFKA_BROKERS: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'driver-service',
  // Must match JWT_ACCESS_SECRET used by auth-service to sign tokens
  JWT_SECRET: process.env.JWT_ACCESS_SECRET || '',
};
