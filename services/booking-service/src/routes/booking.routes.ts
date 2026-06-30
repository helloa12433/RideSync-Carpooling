import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createBookingSchema } from '../validators/booking.schema';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequest(createBookingSchema),
  bookingController.createBooking.bind(bookingController)
);

router.get(
  '/:id',
  bookingController.getBooking.bind(bookingController)
);

router.post(
  '/:id/cancel',
  bookingController.cancelBooking.bind(bookingController)
);

router.get(
  '/user/me',
  bookingController.getUserBookings.bind(bookingController)
);

export default router;
