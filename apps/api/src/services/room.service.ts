import { eq, and, lte, ilike, sql } from "drizzle-orm";
import { db } from "../lib/db.js";
import { room, roomType, roomImage, booking } from "../db/schema.js";

interface RoomFilters {
  type?: string;
  status?: string;
  maxPrice?: number;
  search?: string;
}

export const getAllRooms = async (filters?: RoomFilters) => {
  const query = db
    .select({
      id: room.id,
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      status: room.status,
      latitude: room.latitude,
      longitude: room.longitude,
      floorInfo: room.floorInfo,
      mainImage: room.mainImage,
      rating: room.rating,
      badge: room.badge,
      maxGuests: room.maxGuests,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      type: roomType.name,
      images: sql<string[]>`COALESCE(JSON_AGG(${roomImage.url} ORDER BY ${roomImage.sortOrder}) FILTER (WHERE ${roomImage.url} IS NOT NULL), '[]')`,
    })
    .from(room)
    .innerJoin(roomType, eq(room.roomTypeId, roomType.id))
    .leftJoin(roomImage, eq(roomImage.roomId, room.id))
    .groupBy(room.id, roomType.name);

  const conditions = [];

  if (filters?.type) {
    conditions.push(eq(roomType.name, filters.type));
  }

  if (filters?.status) {
    conditions.push(eq(room.status, filters.status));
  }

  if (filters?.maxPrice) {
    conditions.push(lte(room.pricePerNight, filters.maxPrice));
  }

  if (filters?.search) {
    conditions.push(ilike(room.name, `%${filters.search}%`));
  }

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const rooms = await query;
  return rooms;
};

export const getRoomById = async (id: number) => {
  const roomData = await db.query.room.findFirst({
    where: eq(room.id, id),
    with: {
      roomType: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
  return roomData;
};

export const getFeaturedRooms = async () => {
  return await db
    .select({
      id: room.id,
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      status: room.status,
      latitude: room.latitude,
      longitude: room.longitude,
      floorInfo: room.floorInfo,
      mainImage: room.mainImage,
      rating: room.rating,
      badge: room.badge,
      maxGuests: room.maxGuests,
      type: roomType.name,
    })
    .from(room)
    .innerJoin(roomType, eq(room.roomTypeId, roomType.id))
    .where(eq(room.status, "available"))
    .orderBy(sql`${room.rating} DESC`)
    .limit(4);
};

export const createRoom = async (data: any) => {
  const { images, ...roomData } = data;
  const [newRoom] = await db.insert(room).values(roomData).returning();
  
  if (images && Array.isArray(images) && images.length > 0) {
    const imageRecords = images.map((url: string, index: number) => ({
      roomId: newRoom.id,
      url,
      sortOrder: index
    }));
    await db.insert(roomImage).values(imageRecords);
  }
  
  return newRoom;
};

export const updateRoom = async (id: number, data: any) => {
  const { images, ...roomData } = data;
  
  const [updatedRoom] = await db
    .update(room)
    .set({ ...roomData, updatedAt: new Date() })
    .where(eq(room.id, id))
    .returning();
    
  if (images !== undefined && Array.isArray(images)) {
    // Delete existing images
    await db.delete(roomImage).where(eq(roomImage.roomId, id));
    // Insert new images if any
    if (images.length > 0) {
      const imageRecords = images.map((url: string, index: number) => ({
        roomId: id,
        url,
        sortOrder: index
      }));
      await db.insert(roomImage).values(imageRecords);
    }
  }
    
  return updatedRoom;
};

export const updateRoomStatus = async (id: number, status: string) => {
  const [updatedRoom] = await db
    .update(room)
    .set({ status, updatedAt: new Date() })
    .where(eq(room.id, id))
    .returning();
  return updatedRoom;
};

export const deleteRoom = async (id: number) => {
  // Check if room has any bookings
  const existingBookings = await db.query.booking.findFirst({
    where: eq(booking.roomId, id)
  });
  
  if (existingBookings) {
    throw new Error("Kamar tidak dapat dihapus karena masih memiliki riwayat pesanan (Booking). Silakan ubah status kamar menjadi 'Perawatan' jika tidak ingin digunakan.");
  }

  await db.delete(room).where(eq(room.id, id));
  return { success: true };
};

export const getRoomTypes = async () => {
  return await db.select().from(roomType);
};

export const createRoomType = async (data: { name: string; description?: string }) => {
  const [newRoomType] = await db.insert(roomType).values(data).returning();
  return newRoomType;
};
