// Backend/routes/applicationRoutes.js
import express from "express";
import { updateApplicationStatus } from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isEmployer } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ======================
   🔹 EMPLOYER ACTIONS ON APPLICATIONS
   ====================== */
router.put("/:id/status", protect, isEmployer, updateApplicationStatus); // Accept or Reject applicant

export default router;
