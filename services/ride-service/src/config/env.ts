import dotenv from 'dotenv';
import joi from 'joi';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const envSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(3008),
  CASSANDRA_CONTACT_POINTS: joi.string().required(),
  CASSANDRA_LOCAL_DATACENTER: joi.string().default('datacenter1'),
  CASSANDRA_KEYSPACE: joi.string().required(),
  REDIS_HOST: joi.string().default('localhost'),
  REDIS_PORT: joi.number().default(6379),
  KAFKA_BROKERS: joi.string().required(),
  KAFKA_CLIENT_ID: joi.string().default('ride-service'),
  KAFKA_GROUP_ID: joi.string().default('ride-service-group'),
  RABBITMQ_URL: joi.string().default('amqp://localhost'),
  MAPBOX_ACCESS_TOKEN: joi.string().required(),
  JWT_SECRET: joi.string().default(process.env.JWT_ACCESS_SECRET || 'supersecretjwtkey'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  CASSANDRA_CONTACT_POINTS: envVars.CASSANDRA_CONTACT_POINTS.split(','),
  CASSANDRA_LOCAL_DATACENTER: envVars.CASSANDRA_LOCAL_DATACENTER,
  CASSANDRA_KEYSPACE: envVars.CASSANDRA_KEYSPACE,
  REDIS_HOST: envVars.REDIS_HOST,
  REDIS_PORT: envVars.REDIS_PORT,
  KAFKA_BROKERS: envVars.KAFKA_BROKERS.split(','),
  KAFKA_CLIENT_ID: envVars.KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID: envVars.KAFKA_GROUP_ID,
  RABBITMQ_URL: envVars.RABBITMQ_URL,
  MAPBOX_ACCESS_TOKEN: envVars.MAPBOX_ACCESS_TOKEN,
  JWT_SECRET: envVars.JWT_SECRET,
};
