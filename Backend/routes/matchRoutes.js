import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { matchJobsForUser, matchCandidatesForJob } from "../controllers/matchcontroller.js";

const router = express.Router();

router.get("/jobs", protect, matchJobsForUser);
router.get("/candidates/:jobId", protect, matchCandidatesForJob);

export default router;
