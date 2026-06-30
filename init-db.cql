-- Initialize Cassandra keyspaces and tables for microservices

---------------------------------------------------------
-- Booking Service
---------------------------------------------------------
CREATE KEYSPACE IF NOT EXISTS booking WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE booking;

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY,
  ride_id uuid,
  user_id uuid,
  status text,
  seats int,
  total_price decimal,
  created_at timestamp,
  updated_at timestamp
);

CREATE MATERIALIZED VIEW IF NOT EXISTS bookings_by_user AS
  SELECT * FROM bookings
  WHERE user_id IS NOT NULL AND id IS NOT NULL
  PRIMARY KEY (user_id, id);

---------------------------------------------------------
-- Payment Service
---------------------------------------------------------
CREATE KEYSPACE IF NOT EXISTS payment WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE payment;

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY,
  booking_id uuid,
  user_id uuid,
  amount decimal,
  currency text,
  status text,
  created_at timestamp,
  updated_at timestamp
);

CREATE MATERIALIZED VIEW IF NOT EXISTS payments_by_booking AS
  SELECT * FROM payments
  WHERE booking_id IS NOT NULL AND id IS NOT NULL
  PRIMARY KEY (booking_id, id);

CREATE TABLE IF NOT EXISTS transaction_history (
  payment_id uuid,
  created_at timestamp,
  status text,
  details text,
  PRIMARY KEY (payment_id, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

---------------------------------------------------------
-- Tracking Service
---------------------------------------------------------
CREATE KEYSPACE IF NOT EXISTS tracking WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE tracking;

CREATE TABLE IF NOT EXISTS trip_history (
  id uuid PRIMARY KEY,
  ride_id uuid,
  status text,
  route text,
  distance_km decimal,
  started_at timestamp,
  completed_at timestamp
);

CREATE MATERIALIZED VIEW IF NOT EXISTS trip_history_by_ride AS
  SELECT * FROM trip_history
  WHERE ride_id IS NOT NULL AND id IS NOT NULL
  PRIMARY KEY (ride_id, id);

---------------------------------------------------------
-- AutoShift Service
---------------------------------------------------------
CREATE KEYSPACE IF NOT EXISTS autoshift WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE autoshift;

CREATE TABLE IF NOT EXISTS autoshift_history (
  id uuid PRIMARY KEY,
  ride_id uuid,
  old_driver_id uuid,
  new_driver_id uuid,
  reason text,
  type text,
  status text,
  created_at timestamp,
  completed_at timestamp
);

CREATE MATERIALIZED VIEW IF NOT EXISTS autoshift_history_by_ride AS
  SELECT * FROM autoshift_history
  WHERE ride_id IS NOT NULL AND id IS NOT NULL
  PRIMARY KEY (ride_id, id);

