require('dotenv').config();
const { Client } = require('pg');

// Parse connection string and set SSL explicitly
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('Connecting...');

client.connect()
  .then(() => client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"))
  .then(res => {
    console.log('✅ Connected! Tables:', res.rows.map(r => r.table_name));
    return client.query('SELECT id, name, email, role FROM "user"');
  })
  .then(res => {
    console.log('Users:', JSON.stringify(res.rows, null, 2));
    client.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    client.end().catch(() => {});
    process.exit(1);
  });
