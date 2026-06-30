import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const envSchema = joi.object({
  PORT: joi.number().default(3003),
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  KAFKA_BROKERS: joi.string().required(),
  KAFKA_CLIENT_ID: joi.string().default('booking-service'),
  RABBITMQ_URL: joi.string().required(),
  REDIS_URL: joi.string().required(),
  CASSANDRA_CONTACT_POINTS: joi.string().required(),
  CASSANDRA_LOCAL_DATA_CENTER: joi.string().default('datacenter1'),
  CASSANDRA_KEYSPACE: joi.string().default('booking'),
  RIDE_SERVICE_URL: joi.string().required(),
  PAYMENT_SERVICE_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  kafka: {
    brokers: envVars.KAFKA_BROKERS.split(','),
    clientId: envVars.KAFKA_CLIENT_ID,
  },
  rabbitmq: {
    url: envVars.RABBITMQ_URL,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  cassandra: {
    contactPoints: envVars.CASSANDRA_CONTACT_POINTS.split(','),
    localDataCenter: envVars.CASSANDRA_LOCAL_DATA_CENTER,
    keyspace: envVars.CASSANDRA_KEYSPACE,
  },
  services: {
    ride: envVars.RIDE_SERVICE_URL,
    payment: envVars.PAYMENT_SERVICE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  }
};
