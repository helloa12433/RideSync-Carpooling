export const RIDE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  BOOKING_OPEN: 'BOOKING_OPEN',
  BOOKING_CLOSED: 'BOOKING_CLOSED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const KAFKA_TOPICS = {
  RIDE_CREATED: 'ride.created',
  RIDE_UPDATED: 'ride.updated',
  RIDE_CANCELLED: 'ride.cancelled',
  RIDE_STARTED: 'ride.started',
  RIDE_COMPLETED: 'ride.completed',
  RIDE_EXPIRED: 'ride.expired',
  RIDE_STATUS_UPDATED: 'ride.status.updated',
  RIDE_SEATS_UPDATED: 'ride.seats.updated',
};

export const RABBITMQ_QUEUES = {
  REFUND_QUEUE: 'refund.queue',
  RIDE_EXPIRY_QUEUE: 'ride.expiry.queue',
  NOTIFICATION_QUEUE: 'notification.queue',
  AUTOSHIFT_QUEUE: 'autoshift.queue',
};
