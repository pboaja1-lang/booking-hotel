import "dotenv/config";
import { Pool } from "@neondatabase/serverless";
import { scrypt, randomBytes } from "node:crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const NEW_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin@gmail.com";

// BetterAuth compatible password hashing
// Uses scrypt with: N=16384, r=16, p=1, dkLen=64
// Salt is 16 random bytes as hex string
// Format: salt_hex:derived_key_hex
function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => {
        if (err) reject(err);
        else resolve(`${salt}:${key.toString("hex")}`);
      }
    );
  });
}

async function resetAdminPassword() {
  console.log("🔑 Resetting admin password...\n");

  // Find admin user
  const userRes = await pool.query(
    `SELECT id, name, email, role FROM "user" WHERE email = $1`,
    [ADMIN_EMAIL]
  );

  if (userRes.rows.length === 0) {
    console.log("❌ Admin user not found!");
    await pool.end();
    return;
  }

  const admin = userRes.rows[0];
  console.log(`Found admin: ${admin.email} (${admin.name}), role: ${admin.role}`);

  // Hash the new password
  const hashedPassword = await hashPassword(NEW_PASSWORD);

  // Update password in account table
  const updateRes = await pool.query(
    `UPDATE "account" SET "password" = $1, "updated_at" = NOW() WHERE "user_id" = $2 AND "provider_id" = 'credential'`,
    [hashedPassword, admin.id]
  );

  if (updateRes.rowCount === 0) {
    console.log("❌ No credential account found for admin!");
  } else {
    // Also ensure role is admin
    await pool.query(
      `UPDATE "user" SET "role" = 'admin' WHERE "id" = $1`,
      [admin.id]
    );

    console.log(`\n✅ Admin password reset successfully!`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log(`   Role: admin`);
  }

  await pool.end();
}

resetAdminPassword().catch(console.error);
