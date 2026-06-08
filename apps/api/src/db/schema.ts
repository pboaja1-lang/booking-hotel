import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// BetterAuth Core Tables (with custom fields on user)
// ============================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phone: text("phone"),
  role: text("role").notNull().default("user"), // "user" | "admin"
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }),
});

// ============================================================
// Application Tables
// ============================================================

export const roomType = pgTable("room_type", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const room = pgTable("room", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  roomTypeId: integer("room_type_id")
    .notNull()
    .references(() => roomType.id),
  pricePerNight: integer("price_per_night").notNull(),
  status: text("status").notNull().default("available"), // "available" | "booked" | "maintenance"
  latitude: real("latitude"),
  longitude: real("longitude"),
  floorInfo: text("floor_info"),
  mainImage: text("main_image"),
  rating: real("rating").default(0),
  badge: text("badge"),
  maxGuests: integer("max_guests").default(2),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const roomImage = pgTable("room_image", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id")
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  sortOrder: integer("sort_order").default(0),
});

export const booking = pgTable("booking", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  roomId: integer("room_id")
    .notNull()
    .references(() => room.id),
  checkIn: timestamp("check_in", { mode: "date" }).notNull(),
  checkOut: timestamp("check_out", { mode: "date" }).notNull(),
  nights: integer("nights").notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  specialRequests: text("special_requests"),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  subtotal: integer("subtotal").notNull(),
  taxAmount: integer("tax_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("Pending"), // "Pending" | "Confirmed" | "Done" | "Cancelled"
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => booking.id)
    .unique(),
  method: text("method").notNull(), // "transfer" | "ewallet" | "kredit"
  provider: text("provider"), // "BCA", "GoPay", "Visa"
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "paid" | "failed" | "expired"
  virtualAccountNumber: text("virtual_account_number"),
  paidAt: timestamp("paid_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

// ============================================================
// Relations
// ============================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  bookings: many(booking),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const roomTypeRelations = relations(roomType, ({ many }) => ({
  rooms: many(room),
}));

export const roomRelations = relations(room, ({ one, many }) => ({
  roomType: one(roomType, {
    fields: [room.roomTypeId],
    references: [roomType.id],
  }),
  images: many(roomImage),
  bookings: many(booking),
}));

export const roomImageRelations = relations(roomImage, ({ one }) => ({
  room: one(room, { fields: [roomImage.roomId], references: [room.id] }),
}));

export const bookingRelations = relations(booking, ({ one }) => ({
  user: one(user, { fields: [booking.userId], references: [user.id] }),
  room: one(room, { fields: [booking.roomId], references: [room.id] }),
  payment: one(payment),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  booking: one(booking, {
    fields: [payment.bookingId],
    references: [booking.id],
  }),
}));
