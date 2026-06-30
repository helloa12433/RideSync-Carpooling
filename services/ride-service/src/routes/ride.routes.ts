import { Router } from 'express';
import { rideController } from '../controllers/ride.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { createRideSchema, updateRideSchema, cancelRideSchema } from '../validators/ride.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createRideSchema), rideController.createRide);
router.get('/search', rideController.searchRides.bind(rideController));
router.get('/driver/me', rideController.getDriverRides.bind(rideController));
router.get('/:id', rideController.getRide);
router.put('/:id', validate(updateRideSchema), rideController.updateRide);
router.post('/:id/publish', rideController.publishRide);
router.post('/cancel', validate(cancelRideSchema), rideController.cancelRide);
router.post('/:id/start', rideController.startRide);
router.post('/:id/complete', rideController.completeRide);

export default router;
