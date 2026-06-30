const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'carpool'
});

async function alterTable() {
  try {
    await client.connect();
    console.log('Connected');
    await client.execute('ALTER TABLE rides ADD offered_seats list<text>;');
    console.log('Added offered_seats');
  } catch (e) {
    console.log(e.message);
  }
  
  try {
    await client.execute('ALTER TABLE rides ADD available_seats_list list<text>;');
    console.log('Added available_seats_list');
  } catch(e) {
    console.log(e.message);
  }
  process.exit(0);
}

alterTable();
