import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
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
}
