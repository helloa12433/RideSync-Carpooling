import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/', validate(createUserSchema), userController.createUser);

router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, validate(updateUserSchema), userController.updateProfile);

export default router;
