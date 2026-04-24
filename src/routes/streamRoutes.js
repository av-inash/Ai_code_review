import { Router } from "express"
import { streamController } from "../controllers/streamController.js"
import { validateCodeRequest } from "../middleware/validateRequest.js"
import { reviewRateLimiter } from "../middleware/rateLimiter.js"

const router = Router()

router.post("/review", reviewRateLimiter, validateCodeRequest, streamController.streamReview)
router.post("/explain", reviewRateLimiter, validateCodeRequest, streamController.streamExplain)

export default router