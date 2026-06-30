# Matching Service

Matches drivers to ride requests using Redis GEOSEARCH and coordinates assignments.

## Features
- Create Match Request
- Find Nearby Drivers using Redis GEOSEARCH
- Filter Available Drivers
- Rank Drivers
- Calculate ETA
- Assign Best Driver
- Event-driven using Kafka and RabbitMQ
- Persistence with Cassandra

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```
