# AutoShift Service

Automatically replaces drivers or transfers active rides when the assigned driver or vehicle becomes unavailable.

## Features
- Driver Replacement (ride status ASSIGNED)
- Ride Transfer (ride status IN_PROGRESS)
- Emergency handling
- Consumes Kafka events for driver/vehicle failures
- Delegates driver selection to Matching Service via REST
- Saga Participant (Booking Service orchestrates)

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```
