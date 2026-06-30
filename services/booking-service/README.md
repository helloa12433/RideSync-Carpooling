# Booking Service

Booking Service for the Carpooling Platform. 

## Features
- Create, View, and Cancel Bookings
- Handles seat reservation by communicating with the Ride Service
- Emits Kafka events for created and cancelled bookings
- Handles booking expiry via RabbitMQ delayed messages
- Direct and simple implementation using Node.js, Express, TypeScript

## Prerequisites
- Node.js
- Cassandra
- Redis
- Kafka
- RabbitMQ

## Installation

```bash
npm install
```

## Running Locally

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```
