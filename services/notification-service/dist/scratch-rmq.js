"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
async function test() {
    const conn = await amqplib_1.default.connect('amqp://localhost:5672');
    const ch = await conn.createChannel();
    const queue = 'send-welcome-email';
    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, Buffer.from(JSON.stringify({ email: 'test@example.com', first_name: 'Test', requestId: '123' })));
    console.log('Sent message to RMQ');
    setTimeout(() => { conn.close(); process.exit(0); }, 500);
}
test().catch(console.error);
