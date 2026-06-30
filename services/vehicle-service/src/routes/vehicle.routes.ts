import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validate(createVehicleSchema),
  vehicleController.createProfile
);

router.get(
  '/',
  vehicleController.getDriverVehicles.bind(vehicleController)
);

router.get(
  '/:id',
  vehicleController.getProfile
);

router.put(
  '/:id',
  validate(updateVehicleSchema),
  vehicleController.updateProfile
);

export default router;
