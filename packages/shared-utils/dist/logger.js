"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.tracingMiddleware = exports.requestContext = void 0;
const async_hooks_1 = require("async_hooks");
exports.requestContext = new async_hooks_1.AsyncLocalStorage();
const tracingMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || 'system-' + Date.now();
    exports.requestContext.run({ requestId }, () => {
        next();
    });
};
exports.tracingMiddleware = tracingMiddleware;
class Logger {
    serviceName;
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    formatMessage(level, message, meta = {}) {
        const store = exports.requestContext.getStore();
        const requestId = meta.requestId || store?.requestId || '-';
        if (meta._format === 'multiline_request') {
            return `\n=================================================\nIncoming Request\n\nMethod : ${meta.method}\nRoute  : ${meta.route}\nClient : ${meta.client}\nRequestId : ${requestId}\nTimestamp : ${new Date().toISOString()}\n=================================================`;
        }
        if (meta._format === 'multiline_forward') {
            return `\nForwarding Request\n\nTarget Service : ${meta.targetService}\nTarget URL : ${meta.targetUrl}\nRequestId : ${requestId}\n`;
        }
        if (meta._format === 'multiline_response') {
            return `\nResponse Received\n\nService : ${meta.targetService}\nStatus : ${meta.status}\nLatency : ${meta.latency} ms\nRequestId : ${requestId}\n`;
        }
        if (meta._format === 'multiline_return') {
            return `\nReturning Response To Frontend\n\nRequestId : ${requestId}\nCompleted Successfully\n`;
        }
        // Default structured logging
        let logStr = `[${new Date().toISOString()}] [${this.serviceName}] [${level}] [Req: ${requestId}] - ${message}`;
        const cleanMeta = { ...meta };
        delete cleanMeta.requestId;
        if (Object.keys(cleanMeta).length > 0) {
            logStr += ` | ${JSON.stringify(cleanMeta)}`;
        }
        return logStr;
    }
    info(message, meta = {}) {
        console.log(this.formatMessage('INFO', message, meta));
    }
    error(message, meta = {}) {
        console.error(this.formatMessage('ERROR', message, meta));
    }
    warn(message, meta = {}) {
        console.warn(this.formatMessage('WARN', message, meta));
    }
}
exports.Logger = Logger;
