import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import path from "path"; // <--- Imported path

// Configs & Middlewares
import { envConfig } from "./config/env.config.js";
import { limiter } from "./config/rateLimit.js"; 
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

// Routes
import routes from "./routes/index.js";

const app = express();

// 1. Global Middlewares (Security & Performance)

// Set Security HTTP Headers
// Note: We need to allow loading images from self (for local uploads)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable Gzip Compression
app.use(compression());

// CORS Configuration
app.use(cors({
  origin: envConfig.cors.origin, // Allow requests from Frontend
  credentials: true, // Allow cookies/headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Body Parsing
app.use(express.json({ limit: "16kb" })); // Prevent huge payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// 2. Static Files Serving (Crucial for Local Images)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 3. Custom Middlewares (Logging & Limits)

// Log every request (Method, URL, Status, Time)
app.use(requestLogger);

// Rate Limiting (Prevent DDoS/Spam)
app.use("/api", limiter);

// 4. Routes

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(), 
    uptime: process.uptime() 
  });
});

// Main API Entry Point
app.use("/api/v1", routes);

// 5. Error Handling (Must be last)

// Handle 404 Routes
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export { app };