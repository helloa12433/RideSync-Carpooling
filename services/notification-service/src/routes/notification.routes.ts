import { Router } from 'express';
import { pushTestNotification } from '../controllers/notification.controller';

const router = Router();

// Test route to manually push a notification via HTTP POST
router.post('/test', pushTestNotification);

export default router;
