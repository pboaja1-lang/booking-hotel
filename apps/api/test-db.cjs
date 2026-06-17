require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query("SELECT current_database(), version()"))
  .then(res => {
    console.log('✅ Connected!');
    console.log('Database:', res.rows[0].current_database);
    console.log('Version:', res.rows[0].version.substring(0, 60));
    client.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
