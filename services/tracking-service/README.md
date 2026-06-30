# Tracking Service

Handles real-time trip tracking, driver/passenger locations, ETA calculation, and trip history.

## Features
- Real-time location updates via WebSockets (Socket.IO)
- Fast location storage in Redis
- Trip history persistence in Cassandra
- Publishes and Consumes Kafka Events for ride state changes
- Direct and simple implementation using Node.js, Express, TypeScript

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```
