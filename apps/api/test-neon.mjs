import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://postgres.omcluobkkxceelskpevw:8dPkJgOlP3fovIeA@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');

async function test() {
  try {
    console.log('Testing with Neon serverless (WebSocket)...');
    const result = await sql`SELECT current_database(), version()`;
    console.log('✅ SUCCESS!', result[0].current_database);
  } catch (err) {
    console.log('❌ Error:', err.message?.substring(0, 200));
  }
}

test();
