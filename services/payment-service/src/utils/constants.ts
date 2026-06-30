export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const PAYMENT_STATUS = {
  INTENT_CREATED: 'INTENT_CREATED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUND_REQUESTED: 'REFUND_REQUESTED',
  REFUNDED: 'REFUNDED',
};

export const KAFKA_TOPICS = {
  BOOKING_CREATED: 'booking-created',
  BOOKING_CANCELLED: 'booking-cancelled',
  REFUND_REQUESTED: 'refund-requested',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  PAYMENT_REFUNDED: 'payment-refunded',
  PAYMENT_CANCELLED: 'payment-cancelled',
};

export const RABBITMQ_QUEUES = {
  PAYMENT_TIMEOUT: 'payment-timeout-queue',
  REFUND_PROCESSING: 'refund-processing-queue',
};

export const REDIS_KEYS = {
  PAYMENT_STATUS: 'payment_status:',
};
