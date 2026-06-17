import { Router } from "express";
import { pool } from "../lib/db.js";
import { db } from "../lib/db.js";
import { roomType, room } from "../db/schema.js";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const results: string[] = [];
  
  try {
    results.push("Starting database setup...");

    // Use pool.query directly for DDL statements (CREATE TABLE)
    const client = await pool.connect();
    
    try {
      // Create tables one by one using pool.query (not drizzle)
      await client.query(`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" text PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "email" text NOT NULL,
          "email_verified" boolean DEFAULT false NOT NULL,
          "image" text,
          "phone" text,
          "role" text DEFAULT 'user' NOT NULL,
          "created_at" timestamp NOT NULL,
          "updated_at" timestamp NOT NULL,
          CONSTRAINT "user_email_unique" UNIQUE("email")
        )
      `);
      results.push("✅ Table 'user' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "account" (
          "id" text PRIMARY KEY NOT NULL,
          "account_id" text NOT NULL,
          "provider_id" text NOT NULL,
          "user_id" text NOT NULL,
          "access_token" text,
          "refresh_token" text,
          "id_token" text,
          "access_token_expires_at" timestamp,
          "refresh_token_expires_at" timestamp,
          "scope" text,
          "password" text,
          "created_at" timestamp NOT NULL,
          "updated_at" timestamp NOT NULL
        )
      `);
      results.push("✅ Table 'account' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "session" (
          "id" text PRIMARY KEY NOT NULL,
          "expires_at" timestamp NOT NULL,
          "token" text NOT NULL,
          "created_at" timestamp NOT NULL,
          "updated_at" timestamp NOT NULL,
          "ip_address" text,
          "user_agent" text,
          "user_id" text NOT NULL,
          CONSTRAINT "session_token_unique" UNIQUE("token")
        )
      `);
      results.push("✅ Table 'session' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "verification" (
          "id" text PRIMARY KEY NOT NULL,
          "identifier" text NOT NULL,
          "value" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp,
          "updated_at" timestamp
        )
      `);
      results.push("✅ Table 'verification' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "room_type" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "description" text,
          "created_at" timestamp NOT NULL,
          CONSTRAINT "room_type_name_unique" UNIQUE("name")
        )
      `);
      results.push("✅ Table 'room_type' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "room" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "description" text,
          "room_type_id" integer NOT NULL,
          "price_per_night" integer NOT NULL,
          "status" text DEFAULT 'available' NOT NULL,
          "floor_info" text,
          "main_image" text,
          "rating" real DEFAULT 0,
          "badge" text,
          "max_guests" integer DEFAULT 2,
          "created_at" timestamp NOT NULL,
          "updated_at" timestamp NOT NULL
        )
      `);
      results.push("✅ Table 'room' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "room_image" (
          "id" serial PRIMARY KEY NOT NULL,
          "room_id" integer NOT NULL,
          "url" text NOT NULL,
          "alt_text" text,
          "sort_order" integer DEFAULT 0
        )
      `);
      results.push("✅ Table 'room_image' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "booking" (
          "id" text PRIMARY KEY NOT NULL,
          "user_id" text NOT NULL,
          "room_id" integer NOT NULL,
          "check_in" timestamp NOT NULL,
          "check_out" timestamp NOT NULL,
          "nights" integer NOT NULL,
          "adults" integer DEFAULT 1 NOT NULL,
          "children" integer DEFAULT 0 NOT NULL,
          "special_requests" text,
          "guest_name" text NOT NULL,
          "guest_email" text NOT NULL,
          "guest_phone" text,
          "subtotal" integer NOT NULL,
          "tax_amount" integer NOT NULL,
          "total_amount" integer NOT NULL,
          "status" text DEFAULT 'Pending' NOT NULL,
          "created_at" timestamp NOT NULL,
          "updated_at" timestamp NOT NULL
        )
      `);
      results.push("✅ Table 'booking' created");

      await client.query(`
        CREATE TABLE IF NOT EXISTS "payment" (
          "id" text PRIMARY KEY NOT NULL,
          "booking_id" text NOT NULL,
          "method" text NOT NULL,
          "provider" text,
          "amount" integer NOT NULL,
          "status" text DEFAULT 'pending' NOT NULL,
          "virtual_account_number" text,
          "paid_at" timestamp,
          "expires_at" timestamp,
          "created_at" timestamp NOT NULL,
          CONSTRAINT "payment_booking_id_unique" UNIQUE("booking_id")
        )
      `);
      results.push("✅ Table 'payment' created");

      // Add foreign keys (ignore if already exist)
      const fks = [
        `DO $$ BEGIN ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "booking" ADD CONSTRAINT "booking_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_room_type_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "room_image" ADD CONSTRAINT "room_image_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
        `DO $$ BEGIN ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$`,
      ];

      for (const fk of fks) {
        await client.query(fk);
      }
      results.push("✅ Foreign keys added");

    } finally {
      client.release();
    }

    // 2. Seed Room Types using Drizzle ORM
    results.push("Seeding room types...");
    const types = [
      { name: "Standard Room", description: "Nyaman dan terjangkau untuk 1-2 orang." },
      { name: "Deluxe Room", description: "Kamar luas dengan fasilitas lengkap dan pemandangan indah." },
      { name: "Executive Suite", description: "Pengalaman mewah dengan ruang tamu terpisah." },
      { name: "Private Villa", description: "Privasi maksimal dengan kolam renang pribadi." },
    ];

    const createdTypes: any[] = [];
    for (const t of types) {
      const existing = await db.execute(sql`SELECT * FROM "room_type" WHERE "name" = ${t.name}`);
      if (existing.rows.length === 0) {
        const [inserted] = await db.insert(roomType).values(t).returning();
        createdTypes.push(inserted);
      } else {
        createdTypes.push(existing.rows[0]);
      }
    }
    results.push("✅ Room types seeded");

    const getType = (name: string) => createdTypes.find((t: any) => t.name === name)!.id;

    // 3. Seed Rooms
    results.push("Seeding rooms...");
    const rooms = [
      {
        name: "Ocean View Suite 101",
        description: "Suite mewah dengan pemandangan laut lepas langsung dari balkon pribadi Anda.",
        roomTypeId: getType("Deluxe Room"),
        pricePerNight: 1500000,
        status: "available",
        floorInfo: "Lantai 2 • Maks 3 Tamu",
        mainImage: "https://images.unsplash.com/photo-1582719478250-c89404bb8a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.9,
        badge: "Popular",
        maxGuests: 3,
      },
      {
        name: "Garden Deluxe 204",
        description: "Kamar deluxe yang menghadap ke taman tropis, memberikan suasana asri dan tenang.",
        roomTypeId: getType("Standard Room"),
        pricePerNight: 850000,
        status: "available",
        floorInfo: "Lantai 1 • Maks 2 Tamu",
        mainImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7,
        maxGuests: 2,
      },
      {
        name: "Standard Plus 305",
        description: "Kamar standard dengan tambahan fasilitas premium untuk kenyamanan ekstra.",
        roomTypeId: getType("Standard Room"),
        pricePerNight: 600000,
        status: "available",
        floorInfo: "Lantai 3 • Maks 2 Tamu",
        mainImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.5,
        maxGuests: 2,
      },
      {
        name: "Standard Basic 306",
        description: "Kamar standard yang nyaman untuk istirahat singkat Anda.",
        roomTypeId: getType("Standard Room"),
        pricePerNight: 450000,
        status: "maintenance",
        floorInfo: "Lantai 3 • Maks 2 Tamu",
        mainImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.2,
        maxGuests: 2,
      },
    ];

    for (const r of rooms) {
      const existing = await db.execute(sql`SELECT * FROM "room" WHERE "name" = ${r.name}`);
      if (existing.rows.length === 0) {
        await db.insert(room).values(r);
      }
    }
    results.push("✅ Rooms seeded");

    results.push("🎉 Database setup completed successfully!");

    res.status(200).send(`
      <html>
        <head><title>Database Setup</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: green;">✅ Database Berhasil Disinkronisasi!</h1>
          <ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>
          <hr/>
          <p>Kembali ke <a href="https://booking-hotel-web.vercel.app">Halaman Utama</a></p>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Setup error:", err);
    res.status(500).send(`
      <html>
        <head><title>Database Setup Error</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: red;">❌ Gagal Mengisi Database</h1>
          <p><b>Error:</b> ${err.message}</p>
          <p><b>Progress:</b></p>
          <ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>
        </body>
      </html>
    `);
  }
});

export default router;
