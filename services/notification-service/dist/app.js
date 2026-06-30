"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.frontendUrl, credentials: true }));
app.use(express_1.default.json());
// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'notification-service' });
});
app.use('/api/notifications', notification_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
