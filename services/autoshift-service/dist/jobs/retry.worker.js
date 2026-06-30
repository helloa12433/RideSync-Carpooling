"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRetryWorker = void 0;
const logger_1 = require("../config/logger");
const startRetryWorker = async () => {
    try {
        logger_1.logger.info('RabbitMQ Retry worker started successfully');
    }
    catch (error) {
        logger_1.logger.error('Error starting RabbitMQ Retry worker', error);
    }
};
exports.startRetryWorker = startRetryWorker;
