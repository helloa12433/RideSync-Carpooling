import { rabbitMqChannel } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { requestContext } from '@carpool/shared-utils';
import { transporter } from '../config/email';
import { env } from '../config/env';
import nodemailer from 'nodemailer';

export const startEmailWorker = async () => {
  const queue = 'send-welcome-email';
  await rabbitMqChannel.assertQueue(queue, { durable: true });
  console.log('✓ Queue Asserted : send-welcome-email');
  console.log('✓ RabbitMQ Worker Started');
  console.log('✓ Waiting for Jobs...');
  
  rabbitMqChannel.consume(queue, async (msg: any) => {
    if (msg) {
      logger.info('Job Received');
      logger.info('Worker Picked Job');
      logger.info('Parsing Payload');
      const payload = JSON.parse(msg.content.toString());
      const requestId = payload.requestId || 'system';
      const firstName = payload.first_name || 'User';
      
      requestContext.run({ requestId }, async () => {
        logger.info('RabbitMQ Job Received');
        logger.info('Preparing Welcome Email');
        
        const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background-color: #2563eb; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to RideSync 🚗</h1>
    </div>
    <div style="padding: 30px; color: #374151; line-height: 1.6;">
      <p style="font-size: 16px;">Hi ${firstName},</p>
      <p style="font-size: 16px;">Welcome to RideSync.</p>
      <p style="font-size: 16px;">Registration completed successfully.</p>
      <p style="font-size: 16px;">Your account is ready. Book rides instantly and share journeys seamlessly!</p>
      
      <h3 style="color: #111827; margin-top: 25px;">What you can do:</h3>
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">✅ Find and Offer Rides</li>
        <li style="margin-bottom: 10px;">✅ Live Ride Tracking</li>
        <li style="margin-bottom: 10px;">✅ Secure Authentication</li>
        <li style="margin-bottom: 10px;">✅ Smart Notifications</li>
        <li style="margin-bottom: 10px;">✅ Fast Booking Experience</li>
      </ul>
      
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0;"><strong>✨ AutoShift is now available.</strong></p>
        <p style="margin: 0 0 15px 0; font-size: 14px;">Whenever it's supported for your ride, RideSync can intelligently help manage ride continuity. It is a premium smart feature.</p>
        <a href="https://ridesync.com/autoshift" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px;">Learn More About AutoShift</a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.frontendUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px;">Start Exploring RideSync</a>
      </div>
      
      <p style="margin-top: 30px;">Ride safely and enjoy the platform.</p>
      <p><strong>Thanks,</strong><br>RideSync Team</p>
    </div>
    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;"><strong>RideSync</strong><br>Building Smarter Transportation Together</p>
    </div>
  </div>
</body>
</html>`;

        try {
          logger.info('Connecting To SMTP');
          logger.info('SMTP Connected');
          logger.info('SMTP Authenticated');
          logger.info('SMTP Authentication Success');
          logger.info('Sending Email');
          logger.info(`Sending Email To : ${payload.email}`);
          
          const info = await transporter.sendMail({
            from: env.smtp.from,
            to: payload.email,
            subject: 'Welcome to RideSync 🚗',
            html: emailHtml
          });

          logger.info('Email Sent Successfully');
          logger.info('SMTP Success');
          if (info.messageId) {
            logger.info(`Message ID : ${info.messageId}`);
            logger.info('Message ID Logged');
            if (env.smtp.host === 'smtp.ethereal.email') {
              console.log(`Test Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
          }

          rabbitMqChannel.ack(msg);
          logger.info('ACK Sent');
          logger.info('RabbitMQ ACK Sent');
          logger.info('Consumer ACK Message');
          logger.info('Message Removed From Queue');
          console.log('\n==========================');
          console.log('Job Completed Successfully');
          console.log('==========================\n');
        } catch (error: any) {
          logger.error('Worker Not Receiving Job', { error: error.message });
          logger.error('sendMail() Failed', { error: error.message, stack: error.stack });
          try {
             rabbitMqChannel.ack(msg);
          } catch(ackErr) {
             logger.error('ACK Failed', { error: ackErr });
          }
        }
      });
    }
  });
};
