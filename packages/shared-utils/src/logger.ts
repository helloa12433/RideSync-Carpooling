import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export const tracingMiddleware = (req: any, res: any, next: any) => {
  const requestId = req.headers['x-request-id'] || 'system-' + Date.now();
  requestContext.run({ requestId }, () => {
    next();
  });
};

export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private formatMessage(level: string, message: string, meta: any = {}) {
    const store = requestContext.getStore();
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

  info(message: string, meta: any = {}) {
    console.log(this.formatMessage('INFO', message, meta));
  }

  error(message: string, meta: any = {}) {
    console.error(this.formatMessage('ERROR', message, meta));
  }

  warn(message: string, meta: any = {}) {
    console.warn(this.formatMessage('WARN', message, meta));
  }
}
