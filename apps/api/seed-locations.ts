import { db } from "./src/lib/db.js";
import { room } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const mockLocations = [
  { lat: -6.1862, lng: 106.8341 }, // Near Thamrin
  { lat: -6.2000, lng: 106.8222 }, // Near Sudirman
  { lat: -6.1754, lng: 106.8272 }, // Near Monas
  { lat: -6.2250, lng: 106.8400 }, // Kuningan
  { lat: -6.1500, lng: 106.8100 }, // Jakarta Barat
  { lat: -6.2500, lng: 106.8000 }, // Jakarta Selatan
];

async function seedLocations() {
  console.log("Fetching existing rooms...");
  const rooms = await db.query.room.findMany();
  
  if (rooms.length === 0) {
    console.log("No rooms found to update.");
    process.exit(0);
  }

  console.log(`Found ${rooms.length} rooms. Updating locations...`);

  for (let i = 0; i < rooms.length; i++) {
    const currentRoom = rooms[i];
    // Assign a mock location based on index
    const location = mockLocations[i % mockLocations.length];
    
    // Add some random jitter so they aren't exactly on top of each other if they share a mock location
    const jitterLat = (Math.random() - 0.5) * 0.01;
    const jitterLng = (Math.random() - 0.5) * 0.01;

    await db.update(room)
      .set({
        latitude: location.lat + jitterLat,
        longitude: location.lng + jitterLng,
      })
      .where(eq(room.id, currentRoom.id));
      
    console.log(`Updated room ${currentRoom.id} (${currentRoom.name}) with lat: ${location.lat + jitterLat}, lng: ${location.lng + jitterLng}`);
  }

  console.log("Successfully updated all room locations!");
  process.exit(0);
}

seedLocations().catch((err) => {
  console.error("Error seeding locations:", err);
  process.exit(1);
});
