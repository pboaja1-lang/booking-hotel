require('dotenv').config();
const { Client } = require('pg');

async function test() {
  const client = new Client({
    connectionString: 'postgresql://postgres:8dPkJgOlP3fovIeA@db.omcluobkkxceelskpevw.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
  
  try {
    await client.connect();
    const res = await client.query('SELECT current_database()');
    console.log('✅ Connected successfully!', res.rows[0]);
    await client.end();
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}
test();
