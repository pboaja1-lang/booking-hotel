import { createBooking } from "./src/services/booking.service.js";

async function run() {
  try {
    const booking = await createBooking({
      userId: "pwYRpjhgeOPFwK3mM94k4v5oiqhi4qtj",
      roomId: 1,
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 86400000),
      nights: 1,
      adults: 1,
      children: 0,
      guestName: "Test Guest",
      guestEmail: "test@example.com",
      subtotal: 1000,
      taxAmount: 100,
      totalAmount: 1100,
      paymentMethod: "transfer"
    });
    console.log("Success:", booking);
  } catch (error) {
    console.error("Failed:", error);
  }
}

run();
