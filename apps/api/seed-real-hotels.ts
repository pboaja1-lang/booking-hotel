import { db } from "./src/lib/db.js";
import { room, roomType, booking } from "./src/db/schema.js";
import { eq, inArray } from "drizzle-orm";

const roomTypesData = [
  { name: "Standard Room", description: "Kamar nyaman dengan fasilitas dasar lengkap." },
  { name: "Deluxe Room", description: "Kamar luas dengan pemandangan indah dan fasilitas premium." },
  { name: "Executive Suite", description: "Suite mewah dengan ruang tamu terpisah untuk kenyamanan ekstra." },
  { name: "Private Villa", description: "Vila pribadi dengan kolam renang eksklusif." }
];

const hotels = [
  // JAKARTA
  {
    hotelName: "Hotel Mulia Senayan",
    descPrefix: "Kemewahan klasik di Senayan dengan layanan bintang 5.",
    floorInfo: "Senayan, Jakarta",
    lat: -6.2163, lng: 106.7972,
    basePrice: 3500000,
    mainImage: "/hotels/mulia.jpg",
    rating: 4.8, badge: "Ikon Kota"
  },
  {
    hotelName: "Pullman Jakarta Central Park",
    descPrefix: "Hotel bergaya industrial modern yang terhubung langsung dengan mall Central Park.",
    floorInfo: "Jakarta Barat",
    lat: -6.1774, lng: 106.7906,
    basePrice: 2800000,
    mainImage: "/hotels/pullman.jpg",
    rating: 4.7, badge: "Akses Mall"
  },
  // BANDUNG
  {
    hotelName: "The Trans Luxury Hotel",
    descPrefix: "Kemewahan tiada tara dengan akses langsung ke Trans Studio Mall Bandung.",
    floorInfo: "Bandung, Jawa Barat",
    lat: -6.9255, lng: 107.6366,
    basePrice: 3000000,
    mainImage: "/hotels/trans.jpg",
    rating: 4.8, badge: "Keluarga"
  },
  {
    hotelName: "Padma Hotel Bandung",
    descPrefix: "Menawarkan pemandangan lembah Ciumbuleuit yang menakjubkan dan udara sejuk.",
    floorInfo: "Ciumbuleuit, Bandung",
    lat: -6.8741, lng: 107.6033,
    basePrice: 3200000,
    mainImage: "/hotels/padma.jpg",
    rating: 4.9, badge: "Pemandangan Alam"
  },
  {
    hotelName: "Hilton Bandung",
    descPrefix: "Hotel modern dan elegan di dekat stasiun kereta api utama Bandung.",
    floorInfo: "Pasirkaliki, Bandung",
    lat: -6.9142, lng: 107.5966,
    basePrice: 2500000,
    mainImage: "/hotels/hilton.jpg",
    rating: 4.6, badge: "Pusat Kota"
  },
  // TANGERANG
  {
    hotelName: "JHL Solitaire Gading Serpong",
    descPrefix: "Hotel bintang 5 pertama di Banten dengan desain bangunan yang ikonik.",
    floorInfo: "Gading Serpong, Tangerang",
    lat: -6.2575, lng: 106.6265,
    basePrice: 2800000,
    mainImage: "/hotels/jhl.jpg",
    rating: 4.8, badge: "Arsitektur Unik"
  },
  {
    hotelName: "Swiss-Belhotel Airport",
    descPrefix: "Akomodasi nyaman dan strategis di dekat Bandara Internasional Soekarno-Hatta.",
    floorInfo: "Bandara Soetta, Tangerang",
    lat: -6.1213, lng: 106.6669,
    basePrice: 1500000,
    mainImage: "/hotels/swiss.jpg",
    rating: 4.5, badge: "Dekat Bandara"
  },
  // DEPOK
  {
    hotelName: "The Margo Hotel",
    descPrefix: "Hotel bisnis berbintang 4+ terkemuka di Depok, terletak di jalan Margonda Raya.",
    floorInfo: "Margonda, Depok",
    lat: -6.3713, lng: 106.8335,
    basePrice: 1200000,
    mainImage: "/hotels/margo.jpg",
    rating: 4.6, badge: "Pusat Bisnis"
  },
  {
    hotelName: "Hotel Santika Depok",
    descPrefix: "Menawarkan keramahan khas Indonesia yang terhubung dengan D'Mall Depok.",
    floorInfo: "Margonda, Depok",
    lat: -6.3934, lng: 106.8229,
    basePrice: 800000,
    mainImage: "/hotels/santika.jpg",
    rating: 4.4, badge: "Ekonomis"
  },
  // BEKASI
  {
    hotelName: "Aston Imperial Bekasi",
    descPrefix: "Hotel mewah yang berlokasi strategis di pusat perbelanjaan dan hiburan Bekasi.",
    floorInfo: "Bekasi Barat, Bekasi",
    lat: -6.2464, lng: 106.9934,
    basePrice: 1100000,
    mainImage: "/hotels/aston.jpg",
    rating: 4.5, badge: "Akses Mall"
  },
  {
    hotelName: "Harris Hotel & Conventions",
    descPrefix: "Hotel bergaya hidup sehat dan ceria di kawasan Summarecon Bekasi.",
    floorInfo: "Summarecon Bekasi",
    lat: -6.2238, lng: 106.9996,
    basePrice: 950000,
    mainImage: "/hotels/harris.jpg",
    rating: 4.6, badge: "Modern"
  }
];

// Price multipliers for different room types
const typeMultipliers = {
  "Standard Room": 1,
  "Deluxe Room": 1.5,
  "Executive Suite": 2.5,
  "Private Villa": 4
};

async function seedRealHotels() {
  console.log("Cleaning up old hotels (except booked ones)...");
  
  // Find all rooms
  const allRooms = await db.query.room.findMany();
  let deletedCount = 0;
  
  for (const old of allRooms) {
      // Check if it has bookings
      const bks = await db.query.booking.findMany({ where: eq(booking.roomId, old.id) });
      if (bks.length === 0) {
          await db.delete(room).where(eq(room.id, old.id));
          deletedCount++;
      }
  }
  console.log(`Deleted ${deletedCount} unused old rooms.`);

  console.log("Seeding JABODETABEK & Bandung hotels with unique realistic images and all room types...");
  
  // 1. Ensure all Room Types exist
  const existingTypesDb = await db.select().from(roomType);
  const typeMap = new Map(); // Maps type name to DB id
  
  for (const t of roomTypesData) {
      const existing = existingTypesDb.find(et => et.name === t.name);
      if (existing) {
          typeMap.set(t.name, existing.id);
      } else {
          console.log(`Creating room type: ${t.name}`);
          const [newType] = await db.insert(roomType).values(t).returning();
          typeMap.set(t.name, newType.id);
      }
  }

  // 2. Insert Hotels with multiple room types
  let totalInserted = 0;

  for (const hotel of hotels) {
      for (const [typeName, typeId] of typeMap.entries()) {
          // Calculate price based on multiplier
          const roomPrice = Math.round(hotel.basePrice * typeMultipliers[typeName]);
          const fullName = `${hotel.hotelName} - ${typeName}`;
          const imageNumber = totalInserted + 1;
          
          await db.insert(room).values({
              name: fullName,
              description: `${hotel.descPrefix} Ini adalah pilihan ${typeName} yang sangat cocok untuk Anda.`,
              roomTypeId: typeId,
              pricePerNight: roomPrice,
              status: "available",
              floorInfo: hotel.floorInfo,
              latitude: hotel.lat,
              longitude: hotel.lng,
              mainImage: `/hotels/rooms/room-${imageNumber}.jpg`,
              rating: hotel.rating,
              badge: hotel.badge,
              maxGuests: typeName.includes("Villa") || typeName.includes("Suite") ? 4 : 2
          });
          totalInserted++;
      }
  }

  console.log(`Successfully seeded ${totalInserted} new hotel rooms!`);
  process.exit(0);
}

seedRealHotels().catch((err) => {
  console.error("Error seeding real hotels:", err);
  process.exit(1);
});
