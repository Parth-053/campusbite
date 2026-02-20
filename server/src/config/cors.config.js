import { envConfig } from "./env.config.js";

const whitelist = envConfig.cors.origin;

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (whitelist.includes(origin) || whitelist.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};