import redis from "../config/redis.js"
import crypto from "crypto"

// Cache kitni der tak rakhen — 1 ghanta
const CACHE_TTL = 60 * 60  // seconds mein

export const cacheService = {

  // Code + language ka unique hash banao
  generateKey: (prefix, code, language = "english") => {
    const hash = crypto
      .createHash("md5")
      .update(code + language)
      .digest("hex")
    return `${prefix}:${hash}`
    // Example: "review:a1b2c3d4e5f6..."
  },

  // Cache se data nikalo
  get: async (key) => {
    try {
      const data = await redis.get(key)
      if (data) {
        console.log(`✅ Cache HIT — ${key}`)
        return JSON.parse(data)
      }
      console.log(`❌ Cache MISS — ${key}`)
      return null
    } catch (err) {
      console.warn("Cache get error:", err.message)
      return null  // Cache fail ho toh bhi app chalta rahe
    }
  },

  // Cache mein data save karo
  set: async (key, data) => {
    try {
      await redis.setex(key, CACHE_TTL, JSON.stringify(data))
      console.log(`💾 Cache SET — ${key}`)
    } catch (err) {
      console.warn("Cache set error:", err.message)
      // Cache save na ho toh bhi koi dikkat nahi
    }
  },

  // Cache clear karo (optional)
  delete: async (key) => {
    try {
      await redis.del(key)
    } catch (err) {
      console.warn("Cache delete error:", err.message)
    }
  }
}