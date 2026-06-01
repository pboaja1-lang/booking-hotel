import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { payment, booking } from "../db/schema.js";

export const createPayment = async (data: {
  bookingId: string;
  method: string;
  provider?: string;
  amount: number;
}) => {
  // Generate random VA number if bank transfer
  const virtualAccountNumber = data.method === "transfer" 
    ? `8077${Math.floor(1000000000 + Math.random() * 9000000000)}` 
    : null;

  const paymentId = `PAY-${Date.now()}`;
  
  // Set expiry to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const [newPayment] = await db.insert(payment).values({
    id: paymentId,
    ...data,
    status: "pending",
    virtualAccountNumber,
    expiresAt,
  }).returning();

  return newPayment;
};

export const getPaymentByBookingId = async (bookingId: string) => {
  return await db.query.payment.findFirst({
    where: eq(payment.bookingId, bookingId)
  });
};

export const getPaymentById = async (id: string) => {
  return await db.query.payment.findFirst({
    where: eq(payment.id, id)
  });
};

export const confirmPayment = async (id: string) => {
  return await db.transaction(async (tx) => {
    // 1. Update payment status
    const [updatedPayment] = await tx.update(payment)
      .set({ 
        status: "paid", 
        paidAt: new Date() 
      })
      .where(eq(payment.id, id))
      .returning();

    if (!updatedPayment) throw new Error("Payment not found");

    // 2. Update booking status
    await tx.update(booking)
      .set({ 
        status: "Confirmed",
        updatedAt: new Date()
      })
      .where(eq(booking.id, updatedPayment.bookingId));

    return updatedPayment;
  });
};
