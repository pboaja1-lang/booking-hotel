import { Router } from "express";
import { getAdminDashboardStats, getRecentBookings, getUserDashboardStats, getUpcomingBooking } from "../services/dashboard.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Admin Routes
router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/recent-bookings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const bookings = await getRecentBookings(limit);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Routes
router.get("/me/stats", requireAuth, async (req, res) => {
  try {
    const stats = await getUserDashboardStats(req.user!.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/me/upcoming", requireAuth, async (req, res) => {
  try {
    const booking = await getUpcomingBooking(req.user!.id);
    res.json(booking || null);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
