require('dotenv').config();
const { Client } = require('pg');

async function test() {
  // Try connecting directly using the IPv6 address
  // The DNS resolved db.omcluobkkxceelskpevw.supabase.co to 2406:da18:167b:f900:eccb:da2d:3aab:420f
  
  console.log('Test 1: Direct connection via hostname with SSL...');
  const client1 = new Client({
    host: 'db.omcluobkkxceelskpevw.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '8dPkJgOlP3fovIeA',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });
  
  try {
    await client1.connect();
    const res = await client1.query('SELECT current_database()');
    console.log('✅ Direct connection SUCCESS!');
    console.log('Database:', res.rows[0].current_database);
    await client1.end();
    return;
  } catch (err) {
    console.log('❌ Direct:', err.message.substring(0, 100));
  }

  console.log('\nTest 2: Direct connection via IPv6...');
  const client2 = new Client({
    host: '2406:da18:167b:f900:eccb:da2d:3aab:420f',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '8dPkJgOlP3fovIeA',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });
  
  try {
    await client2.connect();
    const res = await client2.query('SELECT current_database()');
    console.log('✅ IPv6 connection SUCCESS!');
    console.log('Database:', res.rows[0].current_database);
    await client2.end();
    return;
  } catch (err) {
    console.log('❌ IPv6:', err.message.substring(0, 100));
  }

  console.log('\nTest 3: Pooler with explicit host/user params...');
  const client3 = new Client({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.omcluobkkxceelskpevw',
    password: '8dPkJgOlP3fovIeA',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });
  
  try {
    await client3.connect();
    const res = await client3.query('SELECT current_database()');
    console.log('✅ Pooler with explicit params SUCCESS!');
    console.log('Database:', res.rows[0].current_database);
    await client3.end();
    return;
  } catch (err) {
    console.log('❌ Pooler:', err.message.substring(0, 100));
  }
}

test();
