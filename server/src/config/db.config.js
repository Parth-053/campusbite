import mongoose from "mongoose";
import { logger } from "./logger.js";
import { envConfig } from "./env.config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.mongoose.url);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB Connection Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Disconnected');
    });

  } catch (error) {
    logger.error(`❌ Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};