import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createDriverSchema, updateDriverSchema, updateStatusSchema } from '../validators/driver.validator';

const router = Router();

router.use(requireAuth);

router.post('/profile', validate(createDriverSchema), driverController.createProfile);
router.get('/profile', driverController.getProfile);
router.put('/profile', validate(updateDriverSchema), driverController.updateProfile);

router.patch('/status/:id', validate(updateStatusSchema), driverController.updateStatus);
router.get('/status/:id', driverController.getStatus);

export default router;
