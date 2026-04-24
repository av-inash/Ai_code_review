import express from "express";
import dotenv from "dotenv";
import reviewRoutes from "./routes/reviewRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import redis from "./config/redis.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Code Reviewer",
    timestamp: new Date().toISOString(),
  });
});


app.use("/api", reviewRoutes);
app.use("/api/stream", streamRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await redis.connect()  // ← Redis connect
  } catch {
    console.warn("⚠️ Redis connect nahi hua — caching disabled, app chalta rahega")
  }

  app.listen(PORT, () => {
    console.log(`🚀 AI Code Reviewer running on http://localhost:${PORT}`)
  })
}
startServer()