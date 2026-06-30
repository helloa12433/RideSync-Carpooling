import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

export let transporter: nodemailer.Transporter;

export const connectSMTP = async () => {
  try {
    const maskedPass = env.smtp.pass ? '*'.repeat(env.smtp.pass.length) : 'NOT SET';
    logger.info(`SMTP Config Loaded: HOST=${env.smtp.host} PORT=${env.smtp.port} USER=${env.smtp.user || 'NOT SET'} PASS=${maskedPass}`);

    if (env.smtp.user) {
      transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465, 
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });
    } else {
      logger.info('No SMTP credentials found in .env, generating Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      env.smtp.from = testAccount.user;
    }

    await transporter.verify();
    logger.info('SMTP Connected');
    logger.info('SMTP Connected Successfully');
    logger.info('SMTP Authentication Successful');
  } catch (error: any) {
    logger.error(`SMTP Connection failed: ${error.message}`);
    console.error(error);
  }
};
