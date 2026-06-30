import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createPaymentIntentSchema,
  confirmPaymentSchema,
  cancelPaymentSchema,
  refundPaymentSchema,
  webhookSchema,
} from '../validators/payment.schema';

const router = Router();

// Webhook endpoint — no auth (called by payment gateway)
router.post(
  '/webhook',
  validateRequest(webhookSchema),
  paymentController.handleWebhook.bind(paymentController)
);

// All other routes require auth
router.use(authMiddleware);

router.post(
  '/intent',
  validateRequest(createPaymentIntentSchema),
  paymentController.createPaymentIntent.bind(paymentController)
);

router.post(
  '/confirm',
  validateRequest(confirmPaymentSchema),
  paymentController.confirmPayment.bind(paymentController)
);

router.post(
  '/cancel',
  validateRequest(cancelPaymentSchema),
  paymentController.cancelPayment.bind(paymentController)
);

router.post(
  '/refund',
  validateRequest(refundPaymentSchema),
  paymentController.refundPayment.bind(paymentController)
);

router.get(
  '/:paymentId/status',
  paymentController.getPaymentStatus.bind(paymentController)
);

router.get(
  '/booking/:bookingId',
  paymentController.getPaymentByBookingId.bind(paymentController)
);

export default router;
