"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToUser = exports.initSocketGateway = void 0;
const logger_1 = require("../config/logger");
let io;
const initSocketGateway = (socketIo) => {
    io = socketIo;
    io.on('connection', (socket) => {
        logger_1.logger.info(`New client connected: ${socket.id}`);
        // Expect the client to send a register event with their userId
        socket.on('register', (userId) => {
            if (userId) {
                socket.join(userId);
                logger_1.logger.info(`Socket ${socket.id} joined room (userId): ${userId}`);
            }
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`Client disconnected: ${socket.id}`);
        });
    });
};
exports.initSocketGateway = initSocketGateway;
/**
 * Emits an event to a specific user (or driver)
 */
const emitToUser = (userId, eventName, payload) => {
    if (!io) {
        logger_1.logger.warn('SocketGateway: io is not initialized yet.');
        return;
    }
    io.to(userId).emit(eventName, payload);
    logger_1.logger.info(`Emitted '${eventName}' to user ${userId}`, { payload });
};
exports.emitToUser = emitToUser;
