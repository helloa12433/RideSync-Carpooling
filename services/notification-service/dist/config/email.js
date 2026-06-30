"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSMTP = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
const logger_1 = require("./logger");
const connectSMTP = async () => {
    try {
        if (env_1.env.smtp.user) {
            exports.transporter = nodemailer_1.default.createTransport({
                host: env_1.env.smtp.host,
                port: env_1.env.smtp.port,
                secure: env_1.env.smtp.port === 465,
                auth: {
                    user: env_1.env.smtp.user,
                    pass: env_1.env.smtp.pass,
                },
            });
        }
        else {
            logger_1.logger.info('No SMTP credentials found in .env, generating Ethereal test account...');
            const testAccount = await nodemailer_1.default.createTestAccount();
            exports.transporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            env_1.env.smtp.from = testAccount.user;
        }
        await exports.transporter.verify();
        console.log('SMTP Connected Successfully');
        console.log('SMTP Authentication Successful');
    }
    catch (error) {
        console.log(`SMTP Connection failed: ${error.message}`);
        logger_1.logger.error('SMTP Connection failed', error);
    }
};
exports.connectSMTP = connectSMTP;
