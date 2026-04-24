import Redis from "ioredis"
import dotenv from "dotenv"
dotenv.config()

// Railway REDIS_URL deta hai — locally individual vars use hote hain
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)  // Railway pe
  : new Redis({                        // Local pe
      host: process.env.REDISHOST || "localhost",
      port: process.env.REDISPORT || 6379,
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