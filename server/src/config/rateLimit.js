import rateLimit from "express-rate-limit";

// General API Limiter 
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

// Stricter Limiter for Auth Routes (Optional usage in routes)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  message: {
    status: 429,
    message: "Too many login attempts, please try again after an hour"
  }
});