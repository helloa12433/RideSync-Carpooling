"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllConsumers = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const booking_consumer_1 = require("./booking.consumer");
const payment_consumer_1 = require("./payment.consumer");
const ride_consumer_1 = require("./ride.consumer");
const tracking_consumer_1 = require("./tracking.consumer");
const autoshift_consumer_1 = require("./autoshift.consumer");
const auth_consumer_1 = require("./auth.consumer");
const email_worker_1 = require("../jobs/email.worker");
const startAllConsumers = async () => {
    try {
        await (0, booking_consumer_1.startBookingConsumer)();
        await (0, payment_consumer_1.startPaymentConsumer)();
        await (0, ride_consumer_1.startRideConsumer)();
        await (0, tracking_consumer_1.startTrackingConsumer)();
        await (0, autoshift_consumer_1.startAutoShiftConsumer)();
        await (0, email_worker_1.startEmailWorker)();
        await kafka_1.consumer.subscribe({ topic: 'auth.user.registered', fromBeginning: false });
        await kafka_1.consumer.subscribe({ topic: 'auth.user.loggedin', fromBeginning: false });
        await kafka_1.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await (0, booking_consumer_1.handleBookingEvents)(topic, partition, message);
                await (0, payment_consumer_1.handlePaymentEvents)(topic, partition, message);
                await (0, ride_consumer_1.handleRideEvents)(topic, partition, message);
                await (0, tracking_consumer_1.handleTrackingEvents)(topic, partition, message);
                await (0, autoshift_consumer_1.handleAutoShiftEvents)(topic, partition, message);
                if (topic.startsWith('auth.')) {
                    await (0, auth_consumer_1.handleAuthEvents)(topic, partition, message);
                }
            },
        });
        logger_1.logger.info('All Kafka consumers are running');
    }
    catch (error) {
        logger_1.logger.error('Failed to start consumers', error);
    }
};
exports.startAllConsumers = startAllConsumers;
