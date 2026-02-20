import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";
import { envConfig } from "./src/config/env.config.js";
import { logger } from "./src/config/logger.js";
 
// 1. Handle Uncaught Exceptions (Synchronous Code)
 
// Must be at the very top to catch bugs in imports or setup
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(`${err.name}: ${err.message}`);
  // Force exit because the process is in an unclean state
  process.exit(1);
});
 
// 2. Database Connection & Server Start
 
connectDB()
  .then(() => {
    const server = app.listen(envConfig.port,'0.0.0.0', () => {
      logger.info(`🚀 Server running in ${envConfig.env} mode on port ${envConfig.port}`);
      logger.info(`🔗 URL: http://localhost:${envConfig.port}`);
    });

 
    // 3. Handle Unhandled Rejections (Async Promises)
 
    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
      logger.error(`${err.name}: ${err.message}`);
      
      // Close server gracefully first, then exit
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection failed !!!", err);
    process.exit(1);
  });