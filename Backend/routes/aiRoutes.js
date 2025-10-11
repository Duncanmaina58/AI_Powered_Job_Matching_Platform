import express from "express";
import { matchJobsForUser } from "../controllers/aiController.js";

const router = express.Router();

// Get AI-matched jobs for a user
router.get("/match/:userId", matchJobsForUser);

export default router;
