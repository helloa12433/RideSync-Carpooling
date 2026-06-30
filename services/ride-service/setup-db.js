const cassandra = require('cassandra-driver');
require('dotenv').config({path: '../../.env'});

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'carpool'
});

async function setupDb() {
  try {
    await client.connect();
    console.log('Connected to Cassandra');

    const createRidesTable = `
      CREATE TABLE IF NOT EXISTS rides (
        id text PRIMARY KEY,
        driver_id text,
        vehicle_id text,
        source_location text,
        source_lat double,
        source_lng double,
        destination_location text,
        destination_lat double,
        destination_lng double,
        distance double,
        departure_time timestamp,
        estimated_arrival_time timestamp,
        total_seats int,
        available_seats int,
        price_per_seat double,
        status text,
        visibility text,
        offered_seats list<text>,
        available_seats_list list<text>,
        created_at timestamp,
        updated_at timestamp
      );
    `;
    await client.execute(createRidesTable);
    console.log('Created rides table');

    const createRidesByDriverTable = `
      CREATE MATERIALIZED VIEW IF NOT EXISTS rides_by_driver AS
      SELECT * FROM rides
      WHERE driver_id IS NOT NULL AND id IS NOT NULL
      PRIMARY KEY (driver_id, id);
    `;
    await client.execute(createRidesByDriverTable);
    console.log('Created rides_by_driver materialized view');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupDb();
