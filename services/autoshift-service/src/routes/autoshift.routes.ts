import { Router } from 'express';
import { autoshiftController } from '../controllers/autoshift.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { triggerAutoshiftSchema } from '../validators/autoshift.schema';

const router = Router();

router.use(authMiddleware);

router.post(
  '/trigger',
  validateRequest(triggerAutoshiftSchema),
  autoshiftController.triggerAutoshift.bind(autoshiftController)
);

router.get(
  '/ride/:rideId/history',
  autoshiftController.getAutoshiftHistory.bind(autoshiftController)
);

router.get(
  '/:id',
  autoshiftController.getAutoshiftById.bind(autoshiftController)
);

export default router;
