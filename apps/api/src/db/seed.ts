import "dotenv/config";
import { db } from "../lib/db.js";
import { roomType, room, roomImage } from "./schema.js";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Room Types
  const types = [
    { name: "Standard Room", description: "Nyaman dan terjangkau untuk 1-2 orang." },
    { name: "Deluxe Room", description: "Kamar luas dengan fasilitas lengkap dan pemandangan indah." },
    { name: "Executive Suite", description: "Pengalaman mewah dengan ruang tamu terpisah." },
    { name: "Private Villa", description: "Privasi maksimal dengan kolam renang pribadi." },
  ];

  const createdTypes = [];
  for (const t of types) {
    const [inserted] = await db.insert(roomType).values(t).returning();
    createdTypes.push(inserted);
  }
  
  const getType = (name: string) => createdTypes.find((t) => t.name === name)!.id;

  // 2. Create Rooms
  const rooms = [
    {
      name: "Ocean View Suite 101",
      description: "Suite mewah dengan pemandangan laut lepas langsung dari balkon pribadi Anda.",
      roomTypeId: getType("Deluxe Room"),
      pricePerNight: 1500000,
      status: "available",
      floorInfo: "Lantai 2 • Maks 3 Tamu",
      mainImage: "https://images.unsplash.com/photo-1582719478250-c89404bb8a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: "4.9",
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
      rating: "4.7",
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
      rating: "4.5",
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
      rating: "4.2",
      maxGuests: 2,
    },
  ];

  for (const r of rooms) {
    await db.insert(room).values(r);
  }

  // 3. Create Admin User
  console.log("👤 Creating Admin User...");
  try {
    const { auth } = await import("../lib/auth.js");
    const { user } = await import("./schema.js");
    const { eq } = await import("drizzle-orm");

    // Call BetterAuth signup API
    const authRes = await auth.api.signUpEmail({
      body: {
        email: "admin@gmail.com",
        password: "password 12345",
        name: "Admin Venellopy",
      }
    });

    if (authRes?.user) {
      // Update role to admin using Drizzle
      await db.update(user)
        .set({ role: "admin" })
        .where(eq(user.id, authRes.user.id));
      console.log("✅ Admin user created successfully!");
    } else {
      console.log("⚠️ Admin user already exists or failed to create.");
    }
  } catch (error) {
    console.error("⚠️ Error creating admin:", error);
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
