import { eq, and, sum, count, desc } from "drizzle-orm";
import { db } from "../lib/db.js";
import { booking, room, payment } from "../db/schema.js";

export const createBooking = async (data: any) => {
  const bookingId = `BK-${new Date().toISOString().slice(0,10).replace(/-/g, "")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
  
  const { paymentMethod, ...rest } = data;

  const [newBooking] = await db.insert(booking).values({
    id: bookingId,
    userId: rest.userId,
    roomId: rest.roomId,
    checkIn: rest.checkIn,
    checkOut: rest.checkOut,
    nights: rest.nights,
    adults: rest.adults,
    children: rest.children ?? 0,
    specialRequests: rest.specialRequests,
    guestName: rest.guestName,
    guestEmail: rest.guestEmail,
    guestPhone: rest.guestPhone,
    subtotal: rest.subtotal,
    taxAmount: rest.taxAmount,
    totalAmount: rest.totalAmount,
    status: "Pending"
  }).returning();

  if (paymentMethod) {
    await db.insert(payment).values({
      id: `PYM-${bookingId}`,
      bookingId: bookingId,
      method: paymentMethod,
      amount: rest.totalAmount,
      status: "paid",
      paidAt: new Date()
    });
  }

  await db.update(room)
    .set({ status: "booked" })
    .where(eq(room.id, rest.roomId));

  return newBooking;
};

export const getBookingById = async (id: string) => {
  return await db.query.booking.findFirst({
    where: eq(booking.id, id),
    with: {
      room: {
        with: {
          roomType: true
        }
      },
      payment: true,
      user: true
    }
  });
};

export const getBookingsByUserId = async (userId: string, statusFilter?: string) => {
  const conditions = [eq(booking.userId, userId)];
  
  if (statusFilter) {
    conditions.push(eq(booking.status, statusFilter));
  }

  return await db.query.booking.findMany({
    where: and(...conditions),
    with: {
      room: {
        with: {
          roomType: true
        }
      },
      payment: true
    },
    orderBy: [desc(booking.createdAt)]
  });
};

export const getAllBookings = async (statusFilter?: string) => {
  const conditions = [];
  if (statusFilter) {
    conditions.push(eq(booking.status, statusFilter));
  }

  return await db.query.booking.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      room: true,
      user: true,
      payment: true
    },
    orderBy: [desc(booking.createdAt)]
  });
};

export const updateBookingStatus = async (id: string, status: string) => {
  const [updatedBooking] = await db
    .update(booking)
    .set({ status, updatedAt: new Date() })
    .where(eq(booking.id, id))
    .returning();

  if (status === "Cancelled" || status === "Done") {
    // Revert room status to available
    await db.update(room)
      .set({ status: "available" })
      .where(eq(room.id, updatedBooking.roomId));
  }

  return updatedBooking;
};

export const deleteBooking = async (id: string) => {
  // Delete payment associated with the booking first to avoid foreign key constraint error
  await db.delete(payment).where(eq(payment.bookingId, id));
  // Now delete the booking
  await db.delete(booking).where(eq(booking.id, id));
  return { success: true };
};

export const getBookingStats = async () => {
  const allBookings = await db.select({
    status: booking.status,
    totalAmount: booking.totalAmount
  }).from(booking);

  const stats = {
    total: allBookings.length,
    pending: 0,
    confirmed: 0,
    done: 0,
    cancelled: 0,
    revenue: 0
  };

  allBookings.forEach(b => {
    if (b.status === "Pending") stats.pending++;
    if (b.status === "Confirmed") {
      stats.confirmed++;
      stats.revenue += b.totalAmount;
    }
    if (b.status === "Done") {
      stats.done++;
      stats.revenue += b.totalAmount;
    }
    if (b.status === "Cancelled") stats.cancelled++;
  });

  return stats;
};
