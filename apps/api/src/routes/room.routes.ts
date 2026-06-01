import { Router } from "express";
import { 
  getAllRooms, 
  getRoomById, 
  getFeaturedRooms, 
  getRoomTypes, 
  createRoom, 
  updateRoom, 
  updateRoomStatus, 
  deleteRoom, 
  createRoomType 
} from "../services/room.service.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public Routes
router.get("/", async (req, res) => {
  try {
    const { type, status, maxPrice, search } = req.query;
    const filters = {
      type: type as string,
      status: status as string,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string,
    };
    
    const rooms = await getAllRooms(filters);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const rooms = await getFeaturedRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/types", async (req, res) => {
  try {
    const types = await getRoomTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await getRoomById(Number(req.params.id));
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Routes
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const room = await createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const room = await updateRoom(Number(req.params.id), req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const room = await updateRoomStatus(Number(req.params.id), status);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await deleteRoom(Number(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/types", requireAuth, requireAdmin, async (req, res) => {
  try {
    const type = await createRoomType(req.body);
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
