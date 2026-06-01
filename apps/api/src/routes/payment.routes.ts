import { Router } from "express";
import { createPayment, getPaymentByBookingId, confirmPayment, getPaymentById } from "../services/payment.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/booking/:bookingId", requireAuth, async (req, res) => {
  try {
    const payment = await getPaymentByBookingId(req.params.bookingId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/confirm", requireAuth, async (req, res) => {
  try {
    const payment = await confirmPayment(req.params.id);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
