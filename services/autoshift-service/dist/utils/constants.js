"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_KEYS = exports.RABBITMQ_QUEUES = exports.KAFKA_TOPICS = exports.RIDE_STATUS = exports.AUTOSHIFT_REASON = exports.AUTOSHIFT_STATUS = exports.HTTP_STATUS = void 0;
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
exports.AUTOSHIFT_STATUS = {
    STARTED: 'STARTED',
    REPLACEMENT_REQUESTED: 'REPLACEMENT_REQUESTED',
    TRANSFER_REQUESTED: 'TRANSFER_REQUESTED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
};
exports.AUTOSHIFT_REASON = {
    DRIVER_OFFLINE: 'DRIVER_OFFLINE',
    DRIVER_CANCELLED: 'DRIVER_CANCELLED',
    VEHICLE_BREAKDOWN: 'VEHICLE_BREAKDOWN',
    ENGINE_FAILURE: 'ENGINE_FAILURE',
    TYRE_PUNCTURE: 'TYRE_PUNCTURE',
    DRIVER_ACCIDENT: 'DRIVER_ACCIDENT',
    DRIVER_EMERGENCY: 'DRIVER_EMERGENCY',
    RIDE_EMERGENCY: 'RIDE_EMERGENCY',
};
exports.RIDE_STATUS = {
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
};
exports.KAFKA_TOPICS = {
    // Consumed
    DRIVER_OFFLINE: 'driver.offline',
    DRIVER_CANCELLED: 'driver.cancelled',
    VEHICLE_BREAKDOWN: 'vehicle.breakdown',
    VEHICLE_ENGINE_FAILURE: 'vehicle.engine_failure',
    VEHICLE_PUNCTURE: 'vehicle.puncture',
    DRIVER_ACCIDENT: 'driver.accident',
    DRIVER_EMERGENCY: 'driver.emergency',
    RIDE_EMERGENCY: 'ride.emergency',
    // Produced
    AUTOSHIFT_STARTED: 'autoshift.started',
    DRIVER_REPLACED: 'driver.replaced',
    RIDE_TRANSFERRED: 'ride.transferred',
    AUTOSHIFT_COMPLETED: 'autoshift.completed',
    AUTOSHIFT_FAILED: 'autoshift.failed',
};
exports.RABBITMQ_QUEUES = {
    AUTOSHIFT_RETRY: 'autoshift-retry-queue',
};
exports.REDIS_KEYS = {
    AUTOSHIFT_LOCK: 'autoshift_lock:',
    AUTOSHIFT_STATE: 'autoshift_state:',
};
