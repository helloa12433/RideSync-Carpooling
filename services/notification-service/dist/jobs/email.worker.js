"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEmailWorker = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const shared_utils_1 = require("@carpool/shared-utils");
const email_1 = require("../config/email");
const env_1 = require("../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
const startEmailWorker = async () => {
    const queue = 'send-welcome-email';
    await rabbitmq_1.rabbitMqChannel.assertQueue(queue, { durable: true });
    rabbitmq_1.rabbitMqChannel.consume(queue, async (msg) => {
        if (msg) {
            const payload = JSON.parse(msg.content.toString());
            const requestId = payload.requestId || 'system';
            const firstName = payload.first_name || 'User';
            shared_utils_1.requestContext.run({ requestId }, async () => {
                console.log('RabbitMQ Consume');
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
      
      <p style="margin-top: 30px;">Ride safely and enjoy the platform.</p>
      <p><strong>Happy Riding!</strong><br>— Team RideSync</p>
    </div>
    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;"><strong>RideSync</strong><br>Building Smarter Transportation Together</p>
    </div>
  </div>
</body>
</html>`;
                try {
                    console.log('Sending Email');
                    const info = await email_1.transporter.sendMail({
                        from: env_1.env.smtp.from,
                        to: payload.email,
                        subject: 'Welcome to RideSync 🚗',
                        html: emailHtml
                    });
                    console.log('Email Sent Successfully');
                    if (info.messageId) {
                        console.log(`Test Email Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
                    }
                    rabbitmq_1.rabbitMqChannel.ack(msg);
                }
                catch (error) {
                    console.log(`Email Failed: ${error.message || error}`);
                    console.error(error);
                    rabbitmq_1.rabbitMqChannel.ack(msg);
                }
            });
        }
    });
};
exports.startEmailWorker = startEmailWorker;
