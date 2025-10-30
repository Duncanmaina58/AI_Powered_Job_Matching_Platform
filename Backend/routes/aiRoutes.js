import express from "express";
import { getAIMatchedJobs } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route for jobseeker to get AI job matches
router.get("/match/:userId", protect, getAIMatchedJobs);

export default router;
