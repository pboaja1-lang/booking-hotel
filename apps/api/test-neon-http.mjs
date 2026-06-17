import { neon } from '@neondatabase/serverless';

// The HTTP driver uses the pooler URL
const sql = neon('postgresql://postgres.omcluobkkxceelskpevw:8dPkJgOlP3fovIeA@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');

async function test() {
  try {
    console.log('Testing Supabase pooler via Neon HTTP...');
    const result = await sql`SELECT version()`;
    console.log('✅ SUCCESS!', result[0].version);
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

test();
