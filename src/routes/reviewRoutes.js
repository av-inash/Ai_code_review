import { Router } from "express";
import { reviewController } from "../controllers/reviewController.js";
import { validateCodeRequest,validateCompareRequest,validateSecurityRequest } from "../middleware/validateRequest.js";
import { reviewRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/review", reviewRateLimiter, validateCodeRequest, reviewController.reviewCode);
router.post("/explain", reviewRateLimiter, validateCodeRequest, reviewController.explainCode);
router.post("/security-scan", reviewRateLimiter, validateSecurityRequest, reviewController.securityScan)
router.post("/compare", reviewRateLimiter, validateCompareRequest, reviewController.compareCode)


export default router;