import "dotenv/config";
import express from "express";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import setupRoutes from "./routes/setup.routes.js";

const app = express();

// Strip trailing slash to prevent mismatch issues
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    // Allow localhost for development
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    // Allow the configured frontend URL
    if (origin === FRONTEND_URL) {
      return callback(null, true);
    }
    // Allow any *.vercel.app subdomain for Vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    // Reject other origins without crashing the server
    callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/setup-db", setupRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Diagnostic endpoint - check env vars without needing database
app.get("/api/debug-env", (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  res.status(200).json({
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + "..." : "NOT SET",
    hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    region: process.env.VERCEL_REGION,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Booking Hotel API is running", status: "ok" });
});

export default app;
