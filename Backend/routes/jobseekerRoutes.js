import express from "express";

import { getJobseekerStats, getJobseekerProfile, updateJobseekerProfile, uploadProfileFiles } from "../controllers/jobseekerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🟢 Routes
router.get("/stats", protect, getJobseekerStats);
router.get("/profile", protect, getJobseekerProfile);

// ✅ Update profile (with upload support)
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateJobseekerProfile
);

// ✅ Upload profile files (optional separate route)
router.post(
  "/upload",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  uploadProfileFiles
);

export default router;
