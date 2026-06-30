import joi from 'joi';

export const createPaymentIntentSchema = joi.object({
  bookingId: joi.string().uuid().required(),
  userId: joi.string().uuid().required(),
  amount: joi.number().positive().required(),
  currency: joi.string().length(3).default('USD'),
});

export const confirmPaymentSchema = joi.object({
  paymentId: joi.string().uuid().required(),
  transactionId: joi.string().optional(),
});

export const cancelPaymentSchema = joi.object({
  paymentId: joi.string().uuid().required(),
  reason: joi.string().optional(),
});

export const refundPaymentSchema = joi.object({
  paymentId: joi.string().uuid().required(),
  reason: joi.string().optional(),
});

export const webhookSchema = joi.object({
  eventId: joi.string().required(),
  eventType: joi.string().required(),
  data: joi.object({
    object: joi.object({
      id: joi.string().required(),
      metadata: joi.object({
        paymentId: joi.string().required(),
        bookingId: joi.string().required(),
      }).required(),
    }).required().unknown(true),
  }).required(),
});
