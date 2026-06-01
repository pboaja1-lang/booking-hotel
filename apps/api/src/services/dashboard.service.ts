import { desc, eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { booking, room, user } from "../db/schema.js";
import { getBookingStats } from "./booking.service.js";
import { getUserCount } from "./user.service.js";

export const getAdminDashboardStats = async () => {
  const bookingStats = await getBookingStats();
  const rooms = await db.select({ id: room.id }).from(room);
  const userCount = await getUserCount();

  // revenue is calculated in bookingStats
  return {
    totalRooms: rooms.length,
    totalBookings: bookingStats.total,
    revenue: bookingStats.revenue,
    activeUsers: userCount
  };
};

export const getRecentBookings = async (limit: number = 5) => {
  return await db.query.booking.findMany({
    with: {
      room: {
        with: {
          roomType: true
        }
      },
      user: true
    },
    orderBy: [desc(booking.createdAt)],
    limit
  });
};

export const getUserDashboardStats = async (userId: string) => {
  const bookings = await db.select({
    status: booking.status
  }).from(booking).where(eq(booking.userId, userId));

  const stats = {
    totalBookings: bookings.length,
    activeBookings: 0,
    completedBookings: 0
  };

  bookings.forEach(b => {
    if (b.status === "Pending" || b.status === "Confirmed") {
      stats.activeBookings++;
    }
    if (b.status === "Done") {
      stats.completedBookings++;
    }
  });

  return stats;
};

export const getUpcomingBooking = async (userId: string) => {
  return await db.query.booking.findFirst({
    where: (bookings, { eq, and, or }) => and(
      eq(bookings.userId, userId),
      or(eq(bookings.status, "Confirmed"), eq(bookings.status, "Pending"))
    ),
    with: {
      room: {
        with: {
          roomType: true
        }
      }
    },
    orderBy: (bookings, { asc }) => [asc(bookings.checkIn)]
  });
};
