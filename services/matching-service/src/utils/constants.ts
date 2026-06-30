export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MATCHING_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const KAFKA_TOPICS = {
  RIDE_CREATED: 'ride-created',
  RIDE_STATUS_UPDATED: 'ride-status-updated',
  DRIVER_LOCATION_UPDATE: 'driver-location-update',
  DRIVER_ASSIGNED: 'driver-assigned',
};

export const RABBITMQ_QUEUES = {
  MATCHING_REQUEST: 'matching-request-queue',
  MATCHING_RETRY: 'matching-retry-queue',
};

export const REDIS_KEYS = {
  DRIVER_LOCATION: 'driver_locations',
};
