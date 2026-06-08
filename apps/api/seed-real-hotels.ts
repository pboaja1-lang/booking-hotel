import { db } from "./src/lib/db.js";
import { room, roomType, booking } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const realHotels = [
  {
    name: "Hotel Indonesia Kempinski Jakarta",
    description: "Nikmati kemewahan bintang 5 di jantung kota Jakarta, tepat di depan Bundaran HI.",
    pricePerNight: 3500000,
    floorInfo: "Jakarta Pusat",
    lat: -6.1949,
    lng: 106.8230,
    mainImage: "https://images.unsplash.com/photo-1542314831-c6a4d14b8328?w=800&auto=format&fit=crop",
    rating: 4.8,
    badge: "Ikon Kota",
  },
  {
    name: "The Ritz-Carlton Jakarta, Mega Kuningan",
    description: "Kenyamanan luar biasa dengan layanan kelas dunia di kawasan elit Mega Kuningan.",
    pricePerNight: 4200000,
    floorInfo: "Jakarta Selatan",
    lat: -6.2284,
    lng: 106.8286,
    mainImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop",
    rating: 4.7,
    badge: "Mewah",
  },
  {
    name: "Grand Hyatt Jakarta",
    description: "Berada tepat di sebelah Plaza Indonesia, cocok untuk bisnis dan rekreasi.",
    pricePerNight: 3200000,
    floorInfo: "Jakarta Pusat",
    lat: -6.1936,
    lng: 106.8220,
    mainImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
    rating: 4.6,
    badge: "Akses Mall",
  },
  {
    name: "Mandarin Oriental Jakarta",
    description: "Pemandangan indah Bundaran HI dan pelayanan eksklusif Mandarin Oriental.",
    pricePerNight: 3800000,
    floorInfo: "Jakarta Pusat",
    lat: -6.1953,
    lng: 106.8228,
    mainImage: "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=800&auto=format&fit=crop",
    rating: 4.8,
    badge: "Pemandangan Kota",
  },
  {
    name: "Ayana Resort Bali",
    description: "Resor ikonik dengan Rock Bar terkenal dan pemandangan laut yang menakjubkan.",
    pricePerNight: 6500000,
    floorInfo: "Jimbaran, Bali",
    lat: -8.7845,
    lng: 115.1325,
    mainImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
    rating: 4.9,
    badge: "Resor Populer",
  },
  {
    name: "Padma Resort Ubud",
    description: "Ketenangan di tengah rimbunnya hutan Ubud dengan infinity pool air hangat.",
    pricePerNight: 4500000,
    floorInfo: "Ubud, Bali",
    lat: -8.3842,
    lng: 115.2679,
    mainImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop",
    rating: 4.9,
    badge: "Hutan Tropis",
  },
  {
    name: "Mulia Resort Nusa Dua",
    description: "Resor bintang 6 dengan pantai pasir putih pribadi di Nusa Dua.",
    pricePerNight: 7200000,
    floorInfo: "Nusa Dua, Bali",
    lat: -8.8260,
    lng: 115.2220,
    mainImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
    rating: 4.8,
    badge: "Pantai Pribadi",
  },
  {
    name: "The Apurva Kempinski Bali",
    description: "Arsitektur spektakuler bergaya teater terbuka di atas tebing Nusa Dua.",
    pricePerNight: 8500000,
    floorInfo: "Nusa Dua, Bali",
    lat: -8.8280,
    lng: 115.2155,
    mainImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop",
    rating: 4.9,
    badge: "Arsitektur Unik",
  }
];

async function seedRealHotels() {
  console.log("Seeding real hotels to DB...");
  
  // Create a default room type if not exists
  let typeId = 1;
  const existingTypes = await db.select().from(roomType);
  if (existingTypes.length === 0) {
    console.log("Creating default room type 'Deluxe Room'...");
    const [newType] = await db.insert(roomType).values({
      name: "Deluxe Room",
      description: "Standard luxury room"
    }).returning();
    typeId = newType.id;
  } else {
    typeId = existingTypes[0].id;
  }

  // Find all old dummy rooms and try to delete them if they have NO bookings
  // Or we just insert the new ones and keep the old ones. Let's try to delete old ones.
  const oldRooms = await db.query.room.findMany();
  for (const old of oldRooms) {
      // Check if it has bookings
      const bks = await db.query.booking.findMany({ where: eq(booking.roomId, old.id) });
      if (bks.length === 0) {
          await db.delete(room).where(eq(room.id, old.id));
          console.log(`Deleted dummy room: ${old.name}`);
      } else {
          console.log(`Skipped deleting room ${old.name} because it has bookings.`);
      }
  }

  // Insert real hotels
  for (const hotel of realHotels) {
    await db.insert(room).values({
      name: hotel.name,
      description: hotel.description,
      roomTypeId: typeId,
      pricePerNight: hotel.pricePerNight,
      status: "available",
      floorInfo: hotel.floorInfo,
      latitude: hotel.lat,
      longitude: hotel.lng,
      mainImage: hotel.mainImage,
      rating: hotel.rating,
      badge: hotel.badge,
      maxGuests: 2
    });
    console.log(`Inserted real hotel: ${hotel.name}`);
  }

  console.log("Successfully seeded real hotels!");
  process.exit(0);
}

seedRealHotels().catch((err) => {
  console.error("Error seeding real hotels:", err);
  process.exit(1);
});
