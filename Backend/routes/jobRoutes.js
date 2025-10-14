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
  applyForJob,
  getDashboardStats,
  getJobseekerApplications,
  withdrawApplication,
  
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isEmployer } from "../middleware/roleMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";
const router = express.Router();
const upload = multer({ dest: "uploads/cv/" });

/* ======================
   🔹 PUBLIC ROUTES
   ====================== */
router.get("/", getJobs); // Get all jobs

/* ======================
   🔹 JOBSEEKER ROUTES
   ====================== */
router.get("/dashboard", protect, getDashboardStats); // Dashboard stats
router.get("/jobseeker/applications", protect, getJobseekerApplications);
router.post("/:id/apply", protect, upload.single("cv"), applyForJob); // Apply for job
router.delete("/jobseeker/applications/:id", protect, withdrawApplication);
/* ======================
   🔹 EMPLOYER ROUTES
   ====================== */
router.get("/employer", protect, isEmployer, getEmployerJobs); // Employer's jobs
router.post("/", protect, isEmployer, createJob); // Create new job
router.get("/:id/applicants", protect, isEmployer, getJobApplicants); // View job applicants
router.put("/:id", protect, isEmployer, updateJob); // Update job
router.delete("/:id", protect, isEmployer, deleteJob); // Delete job
router.put("/applications/:id/status", protect, updateApplicationStatus);

/* ======================
   🔹 JOB DETAILS ROUTE (MUST BE LAST)
   ====================== */
router.get("/:id", getJobById); // Get single job by ID

export default router;
