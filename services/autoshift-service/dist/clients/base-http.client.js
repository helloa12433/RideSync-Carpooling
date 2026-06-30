"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpClient = void 0;
const logger_1 = require("../config/logger");
class BaseHttpClient {
    async get(url, headers) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP GET failed with status ${response.status}`);
            }
            return (await response.json());
        }
        catch (error) {
            logger_1.logger.error(`GET request to ${url} failed`, error);
            throw error;
        }
    }
    async post(url, body, headers) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP POST failed with status ${response.status}`);
            }
            return (await response.json());
        }
        catch (error) {
            logger_1.logger.error(`POST request to ${url} failed`, error);
            throw error;
        }
    }
    async put(url, body, headers) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP PUT failed with status ${response.status}`);
            }
            return (await response.json());
        }
        catch (error) {
            logger_1.logger.error(`PUT request to ${url} failed`, error);
            throw error;
        }
    }
}
exports.BaseHttpClient = BaseHttpClient;
