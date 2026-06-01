import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
    role: string;
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized: Session not found" });
      return;
    }

    req.user = session.user as AuthRequest["user"];
    req.session = session.session as AuthRequest["session"];
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid session" });
  }
}
