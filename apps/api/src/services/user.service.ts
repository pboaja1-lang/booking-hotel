import { eq, ilike, and } from "drizzle-orm";
import { db } from "../lib/db.js";
import { user } from "../db/schema.js";

export const getUserById = async (id: string) => {
  return await db.query.user.findFirst({
    where: eq(user.id, id)
  });
};

export const updateUserProfile = async (id: string, data: { name?: string; phone?: string; image?: string }) => {
  const [updatedUser] = await db
    .update(user)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(user.id, id))
    .returning();
  return updatedUser;
};

export const getAllUsers = async (search?: string) => {
  const conditions = [eq(user.role, "user")];
  
  if (search) {
    conditions.push(ilike(user.name, `%${search}%`));
  }

  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    })
    .from(user)
    .where(and(...conditions));
};

export const getUserCount = async () => {
  const users = await db.select({ id: user.id }).from(user).where(eq(user.role, "user"));
  return users.length;
};
