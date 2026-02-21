import { envConfig } from "./env.config.js";

const whitelist = envConfig.cors.origin;

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (whitelist.includes(origin) || whitelist.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error(`SECURITY BLOCK: CORS origin ${origin} is not allowed to access this server.`));
    }
  },
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};