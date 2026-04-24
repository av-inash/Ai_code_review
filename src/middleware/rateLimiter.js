import rateLimit from "express-rate-limit";

export const reviewRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // only 10 reviews per minute — AI calls are expensive
  message: {
    success: false,
    error: "Too many requests. Maximum 10 code reviews per minute.",
  },
});