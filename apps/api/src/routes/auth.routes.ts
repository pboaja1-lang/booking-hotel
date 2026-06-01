import { Router } from "express";
import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Mount better-auth to Express
router.all(/.*/, toNodeHandler(auth));

export default router;
