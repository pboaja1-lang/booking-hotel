import "dotenv/config";
import { scrypt, randomBytes } from "node:crypto";
import { db } from "./src/lib/db.js";
import { user, account } from "./src/db/schema.js";
import { eq, and } from "drizzle-orm";

const NEW_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin@gmail.com";

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

  const users = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL));

  if (users.length === 0) {
    console.log("❌ Admin user not found! You might need to seed the database first.");
    process.exit(0);
  }

  const admin = users[0];
  console.log(`Found admin: ${admin.email} (${admin.name}), role: ${admin.role}`);

  const hashedPassword = await hashPassword(NEW_PASSWORD);

  const updatedAccounts = await db
    .update(account)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(and(eq(account.userId, admin.id), eq(account.providerId, "credential")))
    .returning();

  if (updatedAccounts.length === 0) {
    console.log("❌ No credential account found for admin!");
  } else {
    await db.update(user).set({ role: "admin" }).where(eq(user.id, admin.id));
    console.log(`\n✅ Admin password reset successfully!`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log(`   Role: admin`);
  }
  
  process.exit(0);
}

resetAdminPassword().catch(err => {
  console.error(err);
  process.exit(1);
});
