import rateLimit from "express-rate-limit";

// SECURITY: General API Limiter against DDoS attacks
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "SECURITY BLOCK: Too many requests from this IP. Please try again after 15 minutes."
  }
});

// SECURITY: Strict Limiter against Brute-Force Authentication attacks
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Maximum 10 hits to Auth routes per hour
  message: {
    success: false,
    message: "SECURITY BLOCK: Too many authentication attempts. Your IP is locked for 1 hour."
  }
});