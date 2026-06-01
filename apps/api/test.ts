import { db } from "./src/lib/db.js";
import { booking } from "./src/db/schema.js";

async function run() {
  const bookings = await db.query.booking.findMany({
    with: {
      room: {
        with: {
          roomType: true
        }
      }
    }
  });
  console.log(JSON.stringify(bookings, null, 2));
}

run().catch(console.error);
