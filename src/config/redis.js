import Redis from "ioredis"

import dotenv from "dotenv"
dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,

  
  // Agar Redis down ho toh app crash na ho
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn("Redis connect nahi hua — caching disabled")
      return null
    }
    return Math.min(times * 100, 3000)
  }
})

redis.on("connect", () => {
  console.log("✅ Redis connected")
})

redis.on("error", (err) => {
  console.warn("⚠️ Redis error — caching disabled:", err.message)
})

export default redis
