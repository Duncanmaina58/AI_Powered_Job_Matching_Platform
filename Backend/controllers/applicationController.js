// Backend/controllers/applicationController.js

import Application from "../models/Applicant.js";
import Notification from "../models/Notification.js";
import { io, onlineUsers } from "../server.js"; // Import socket and online users map
import asyncHandler from "express-async-handler";
import Applicant from "../models/Applicant.js";

/**
 * @desc Apply for a job
 * @route POST /api/applications
 * @access Jobseeker
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const applicantId = req.user._id;

  // Check if already applied
  const existingApp = await Application.findOne({ job: jobId, applicant: applicantId });
  if (existingApp) {
    return res.status(400).json({ message: "You have already applied for this job." });
  }

  const newApplication = await Application.create({
    job: jobId,
    applicant: applicantId,
    coverLetter,
    status: "pending",
  });

  // Notify employer (optional)
  const notification = {
    title: "New Job Application",
    message: `You have received a new application for one of your jobs.`,
    type: "new_application",
    timestamp: new Date(),
  };

  await Notification.create({
    user: newApplication.job?.employer,
    ...notification,
  });

  // Emit to employer if online
  const employerSocket = onlineUsers.get(newApplication.job?.employer?.toString());
  if (employerSocket) {
    io.to(employerSocket).emit("newNotification", notification);
  }

  res.status(201).json({ message: "Application submitted successfully", newApplication });
});

/**
 * @desc Get all applications (admin)
 * @route GET /api/applications
 * @access Admin
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("applicant", "name email")
    .populate("job", "title");

  res.json(applications);
});

/**
 * @desc Get applications by jobseeker
 * @route GET /api/applications/my
 * @access Jobseeker
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title employer status")
    .sort({ createdAt: -1 });

  res.json(applications);
});

/**
 * @desc Get applications for employer's jobs
 * @route GET /api/applications/employer
 * @access Employer
 */
export const getEmployerApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate({
      path: "job",
      match: { employer: req.user._id },
      select: "title",
    })
    .populate("applicant", "name email")
    .sort({ createdAt: -1 });

  // Filter out applications for other employers
  const filtered = applications.filter(app => app.job);
  res.json(filtered);
});

/**
 * @desc Update application status (approve, reject, shortlist)
 * @route PUT /api/applications/:id/status
 * @access Employer
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // applicant ID
    const { status } = req.body;

    console.log("🔹 Incoming status update:", id, { status });

    // ✅ Update applicant status and populate job + user
    const application = await Applicant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("job")
      .populate("user"); // ✅ Correct field name

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Create notification for the applicant (if registered)
    if (application.user) {
      const message = `Your application for ${application.job.title} was ${status}.`;

      await Notification.create({
        user: application.user._id,
        message,
      });

      // ✅ Emit real-time notification if user is online
      const applicantSocket = onlineUsers.get(application.user._id.toString());
      if (applicantSocket) {
        io.to(applicantSocket).emit("newNotification", { message });
        console.log("📨 Real-time notification sent to:", application.user._id);
      }
    }

    res.json(application);
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * @desc Delete an application (optional)
 * @route DELETE /api/applications/:id
 * @access Admin or Jobseeker
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findById(id);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (
    req.user.role !== "admin" &&
    application.applicant.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized to delete this application" });
  }

  await application.deleteOne();
  res.json({ message: "Application deleted successfully" });
});
