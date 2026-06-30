export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const KAFKA_TOPICS = {
  DRIVER_LOCATION_UPDATE: 'driver-location-update',
  RIDE_STARTED: 'ride-started',
  RIDE_COMPLETED: 'ride-completed',
  RIDE_CANCELLED: 'ride-cancelled',
};

export const REDIS_KEYS = {
  LIVE_LOCATION: 'live_location:',
};

export const TRIP_STATUS = {
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};
