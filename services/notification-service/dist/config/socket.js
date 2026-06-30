"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("./env");
const socket_gateway_1 = require("../websocket/socket.gateway");
const logger_1 = require("./logger");
const setupSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.env.frontendUrl,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    (0, socket_gateway_1.initSocketGateway)(io);
    logger_1.logger.info('Socket.IO initialized');
    return io;
};
exports.setupSocket = setupSocket;
