import { AsyncLocalStorage } from 'async_hooks';
export declare const requestContext: AsyncLocalStorage<{
    requestId: string;
}>;
export declare const tracingMiddleware: (req: any, res: any, next: any) => void;
export declare class Logger {
    private serviceName;
    constructor(serviceName: string);
    private formatMessage;
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
}
