import { Router } from 'express';
import { trackingController } from '../controllers/tracking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { updateLocationSchema } from '../validators/tracking.schema';

const router = Router();

router.use(authMiddleware);

router.post(
  '/location',
  validateRequest(updateLocationSchema),
  trackingController.updateDriverLocation.bind(trackingController)
);

router.get(
  '/:rideId/state',
  trackingController.getTrackingState.bind(trackingController)
);

router.get(
  '/:rideId/history',
  trackingController.getTripHistory.bind(trackingController)
);

export default router;
