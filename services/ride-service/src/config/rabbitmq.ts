import amqp, { Connection, Channel } from 'amqplib';
import { env } from './env';
import { logger } from './logger';

class RabbitMQConnection {
  private connection: any = null;
  public channel: Channel | null = null;

  public async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      logger.info('Connected to RabbitMQ successfully');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ', { error });
      process.exit(1);
    }
  }

  public async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

export const rabbitmq = new RabbitMQConnection();
