import { Router } from 'express';
import { googleLogin, refresh, logout, getMe, updateRole } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.put('/role', requireAuth, updateRole);

export default router;
