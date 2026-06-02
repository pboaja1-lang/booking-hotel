import { Router } from "express";
import { getUserById, updateUserProfile, getAllUsers } from "../services/user.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// User routes
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const { name, phone, image } = req.body;
    const user = await updateUserProfile(req.user!.id, { name, phone, image });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin routes
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    const users = await getAllUsers(search as string);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
