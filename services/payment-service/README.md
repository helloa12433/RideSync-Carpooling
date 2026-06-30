# Payment Service

Handles all payment-related operations for the carpooling platform. Acts as a Saga participant.

## Features
- Create Payment Intent
- Confirm Payment
- Cancel Payment
- Refund Payment
- Handles Payment Webhooks
- Handles Payment Timeouts (via RabbitMQ)
- Communicates via Kafka Events
- Direct and simple implementation using Node.js, Express, TypeScript

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```
