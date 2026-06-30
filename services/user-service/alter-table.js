const { Client } = require('cassandra-driver');

const client = new Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'carpool',
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Cassandra');
    
    try {
      await client.execute('ALTER TABLE users ADD phone_number text;');
      console.log('Added phone_number');
    } catch (e) {
      console.log('phone_number already exists or error:', e.message);
    }
    
    try {
      await client.execute('ALTER TABLE users ADD country_code text;');
      console.log('Added country_code');
    } catch (e) {
      console.log('country_code already exists or error:', e.message);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
