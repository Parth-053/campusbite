import app from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";
import { envConfig } from "./src/config/env.config.js";
import { logger } from "./src/config/logger.js";

// ==================== CRASH PREVENTION ====================
// Catch synchronous errors that escape the Express flow
process.on("uncaughtException", (err) => {
  logger.error(`🛑 UNCAUGHT EXCEPTION: ${err.message}`);
  logger.error("Shutting down the server due to uncaught exception...");
  process.exit(1);
});

// ==================== INITIALIZATION ====================
let server;

const startServer = async () => {
  try {
    // 1. Securely connect to Database first
    await connectDB();

    // 2. Start listening to incoming requests
    server = app.listen(envConfig.port, () => {
      logger.info(`🚀 Server running in ${envConfig.env} mode on port ${envConfig.port}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// ==================== GRACEFUL SHUTDOWN ====================
// Catch asynchronous unhandled promise rejections (e.g., failed external API calls)
process.on("unhandledRejection", (err) => {
  logger.error(`🛑 UNHANDLED REJECTION: ${err.message}`);
  logger.error("Shutting down the server safely...");
  
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle termination signals (from Docker, Heroku, or Ctrl+C) gracefully
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      logger.info("💥 Process terminated.");
    });
  }
});