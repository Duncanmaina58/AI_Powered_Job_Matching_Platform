// Backend/controllers/applicationController.js

import Application from "../models/Applicant.js";
import Notification from "../models/Notification.js";
import { io, onlineUsers } from "../server.js"; // Import socket and online users map
import asyncHandler from "express-async-handler";

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
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id)
    .populate("applicant", "name email _id")
    .populate("job", "title employer");

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Ensure the employer owns the job
  if (application.job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this application" });
  }

  // Update status
  application.status = status;
  await application.save();

  // Create notification
  const notification = {
    title: "Application Status Updated",
    message: `Your application for "${application.job.title}" was ${status}.`,
    type: "application_status",
    timestamp: new Date(),
  };

  await Notification.create({
    user: application.applicant._id,
    ...notification,
  });

  // Emit via socket if online
  const applicantSocket = onlineUsers.get(application.applicant._id.toString());
  if (applicantSocket) {
    io.to(applicantSocket).emit("newNotification", notification);
    console.log(`🔔 Sent notification to ${application.applicant.name}`);
  } else {
    console.log(`📪 ${application.applicant.name} is offline`);
  }

  res.json({
    message: "Application status updated successfully",
    application,
  });
});

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
