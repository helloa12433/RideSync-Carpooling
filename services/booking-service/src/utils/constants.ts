export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const KAFKA_TOPICS = {
  BOOKING_CREATED: 'booking-created',
  BOOKING_CANCELLED: 'booking-cancelled',
};

export const RABBITMQ_QUEUES = {
  BOOKING_EXPIRY: 'booking-expiry-queue',
};
