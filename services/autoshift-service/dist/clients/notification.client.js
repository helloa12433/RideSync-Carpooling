"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationClient = exports.NotificationClient = void 0;
const base_http_client_1 = require("./base-http.client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class NotificationClient extends base_http_client_1.BaseHttpClient {
    baseUrl = env_1.env.services.notification;
    async sendNotification(userId, message) {
        try {
            await this.post(`${this.baseUrl}/api/v1/notifications/send`, { userId, message });
            return true;
        }
        catch (error) {
            logger_1.logger.error(`Error sending notification to user ${userId}`, error);
            return false;
        }
    }
}
exports.NotificationClient = NotificationClient;
exports.notificationClient = new NotificationClient();
