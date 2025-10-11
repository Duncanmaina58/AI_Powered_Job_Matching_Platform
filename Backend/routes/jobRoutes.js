// Backend/routes/jobRoutes.js
import express from "express";
import {
  getJobs,
  createJob,
  getEmployerJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants
} from "../controllers/jobController.js";
import { applyForJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isEmployer } from "../middleware/roleMiddleware.js";
// import { getJobApplicants } from "../controllers/jobController.js";
const router = express.Router();

// 🟢 Public routes
router.get("/", getJobs);
router.post("/:id/apply", protect, applyForJob);
// 🟢 Protected routes (Employer only)
router.post("/", protect, isEmployer, createJob);
router.get("/employer", protect, isEmployer, getEmployerJobs);

// 🟢 ID-based routes (must come last!)
router.get("/:id", getJobById);
router.put("/:id", protect, isEmployer, updateJob);
router.delete("/:id", protect, isEmployer, deleteJob);
router.get("/:id/applicants", protect, isEmployer, getJobApplicants);
router.route("/:id/applicants").get(protect, getJobApplicants);
export default router;
