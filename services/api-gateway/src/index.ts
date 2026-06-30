import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { logger } from './utils/logger';

dotenv.config({ path: '../../.env' });

const app = express();

app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  
  logger.info('', { 
    _format: 'multiline_request', 
    method: req.method, 
    route: req.originalUrl, 
    client: req.ip || '127.0.0.1', 
    requestId 
  });
  if (req.originalUrl.includes('/profile') && req.method === 'PUT') {
    console.log('\n==========================');
    console.log('Frontend Request Received');
    console.log('↓');
  }

  next();
});

const createLoggingProxy = (target: string, serviceName: string, ws: boolean = false) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws,
    on: {
      proxyReq: (proxyReq: any, req: any, res: any) => {
        req.startTime = Date.now();
        if (req.originalUrl.includes('/profile') && req.method === 'PUT') {
           console.log('API Gateway Forwarded');
           console.log('↓');
        }
        logger.info('', { _format: 'multiline_forward', targetService: serviceName, targetUrl: target, requestId: req.headers['x-request-id'] });
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        const latency = Date.now() - req.startTime;
        const requestId = req.headers['x-request-id'];
        if (req.originalUrl.includes('/profile') && req.method === 'PUT') {
           console.log('API Gateway Response Sent');
           console.log('↓');
        }
        logger.info('', { _format: 'multiline_response', targetService: serviceName, status: proxyRes.statusCode, latency, requestId });
        
        res.on('finish', () => {
          logger.info('', { _format: 'multiline_return', requestId });
        });
      },
      error: (err: any, req: any, res: any) => {
        logger.error('Proxy Error', { target: serviceName, error: err.message, requestId: req.headers['x-request-id'] });
      }
    }
  });
};

app.use('/auth', createLoggingProxy('http://localhost:3001', 'Auth Service'));
app.use('/api/users', createLoggingProxy('http://localhost:3010', 'User Service'));
app.use('/api/drivers', createLoggingProxy('http://localhost:3004', 'Driver Service'));
app.use('/api/vehicles', createLoggingProxy('http://localhost:3011', 'Vehicle Service'));
app.use('/api/rides', createLoggingProxy('http://localhost:3008', 'Ride Service'));
app.use('/api/v1/bookings', createLoggingProxy('http://localhost:3003', 'Booking Service'));
app.use('/api/v1/matchings', createLoggingProxy('http://localhost:3005', 'Matching Service', true));
app.use('/api/notifications', createLoggingProxy('http://localhost:3006', 'Notification Service', true));
app.use('/api/v1/payments', createLoggingProxy('http://localhost:3007', 'Payment Service'));
app.use('/api/v1/tracking', createLoggingProxy('http://localhost:3009', 'Tracking Service', true));
app.use('/api/v1/autoshift', createLoggingProxy('http://localhost:3002', 'Autoshift Service'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
