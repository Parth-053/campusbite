import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Security & Configs
import { corsOptions } from "./config/cors.config.js";
import { limiter } from "./config/rateLimit.js";

// Middlewares
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

// Routes
import mainRoutes from "./routes/index.js";

const app = express();

// ==================== SECURITY MIDDLEWARES ====================
// Set security HTTP headers (Hides Express signature, prevents XSS, etc.)
app.use(helmet());

// Cross-Origin Resource Sharing based on whitelist
app.use(cors(corsOptions));

// Rate limiting against DDoS and brute force
app.use(limiter);

// ==================== STANDARD MIDDLEWARES ====================
// Body parsers with limits to prevent payload size attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Parse cookies securely
app.use(cookieParser());

// Custom request logger for audit trails
app.use(requestLogger);

// Serve static files (like uploaded images) securely
app.use(express.static("public"));

// ==================== API ROUTES ====================
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is highly secure and running!" });
});

// Main API Routes mounted
app.use("/api", mainRoutes);

// ==================== ERROR HANDLING ====================
// 404 Route Handler for undefined endpoints
app.use(notFound);

// Global Error Handler (Hides stack traces in production)
app.use(globalErrorHandler);

export default app;