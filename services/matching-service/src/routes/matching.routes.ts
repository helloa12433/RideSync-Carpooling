import { Router } from 'express';
import { matchingController } from '../controllers/matching.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { createMatchingSchema } from '../validators/matching.schema';

const router = Router();

router.post(
  '/',
  validateRequest(createMatchingSchema),
  matchingController.processMatching.bind(matchingController)
);

router.get('/search', matchingController.searchRides.bind(matchingController));

export default router;
