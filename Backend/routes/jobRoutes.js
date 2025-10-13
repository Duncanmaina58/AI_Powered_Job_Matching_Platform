// Backend/routes/jobRoutes.js
import express from "express";
import multer from "multer";
import {
  getJobs,
  createJob,
  getEmployerJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants,
  applyForJob, // ✅ Only this one (applyJob was removed)
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isEmployer } from "../middleware/roleMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/cv/" });
router.post("/:id/apply", protect, upload.single("cv"), applyForJob);
/* ======================
   🔹 PUBLIC ROUTES
   ====================== */
router.get("/", getJobs); // View all jobs (for jobseekers)

/* ======================
   🔹 JOBSEEKER ROUTES
   ====================== */
router.post("/:id/apply", protect, applyForJob); // Apply for a job

/* ======================
   🔹 EMPLOYER ROUTES
   ====================== */
router.post("/", protect, isEmployer, createJob); // Create a job
router.get("/employer", protect, isEmployer, getEmployerJobs); // Employer’s job listings
router.get("/:id/applicants", protect, isEmployer, getJobApplicants); // View applicants for one job
router.put("/:id", protect, isEmployer, updateJob); // Update a job
router.delete("/:id", protect, isEmployer, deleteJob); // Delete a job

/* ======================
   🔹 PUBLIC JOB DETAILS
   ====================== */
router.get("/:id", getJobById); // Get job by ID (open to everyone)

export default router;
