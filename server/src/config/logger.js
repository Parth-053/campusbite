import winston from "winston";
import { envConfig } from "./env.config.js";

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  const logMessage = stack && envConfig.env === "development" ? stack : message;
  return `${timestamp} [${level.toUpperCase()}]: ${logMessage}`;
});

export const logger = winston.createLogger({
  level: envConfig.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),  
    envConfig.env === "development" ? winston.format.colorize() : winston.format.uncolorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), 
  ],
});