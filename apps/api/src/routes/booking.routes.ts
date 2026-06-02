import { Router } from "express";
import { 
  createBooking, 
  getBookingById, 
  getBookingsByUserId, 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  getBookingStats
} from "../services/booking.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// User Routes
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const body = req.body;

    const bookingData = {
      userId,
      roomId: Number(body.roomId),
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      nights: Number(body.nights),
      adults: Number(body.adults),
      children: Number(body.children ?? 0),
      specialRequests: body.specialRequests,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      subtotal: Number(body.subtotal),
      taxAmount: Number(body.taxAmount),
      totalAmount: Number(body.totalAmount),
      paymentMethod: body.paymentMethod,
    };

    const booking = await createBooking(bookingData);
    
    // Fetch the full booking with relations (room, payment, user) so frontend maps correctly
    const fullBooking = await getBookingById(booking.id);
    
    res.status(201).json(fullBooking);
  } catch (error: any) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;
    const bookings = await getBookingsByUserId(userId, status as string);
    res.json(bookings);
  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id as string);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    if (booking.userId !== req.user!.id && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    res.json(booking);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Admin Routes
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const bookings = await getAllBookings(status as string);
    res.json(bookings);
  } catch (error: any) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await getBookingStats();
    res.json(stats);
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const booking = await updateBookingStatus(req.params.id as string, status);
    res.json(booking);
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await deleteBooking(req.params.id as string);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
