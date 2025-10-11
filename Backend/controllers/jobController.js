// Backend/controllers/jobController.js

import Job from "../models/Job.js";
import asyncHandler from "express-async-handler";
import Applicant from "../models/Applicant.js";
// 💡 Helper function to get company name (assuming company_name is on req.user)
const getCompanyName = (req) => {
    // If you stored company_name on the User model during registration, use it.
    // If not, you might need a separate field on the User model for employer company.
    return req.user.company_name || 'N/A Company Name'; 
};


/**
 * @desc Get all jobs (Public)
 * @route GET /api/jobs
 * @access Public
 */
export const getJobs = asyncHandler(async (req, res) => {
    // 💡 Updated to populate the 'user' field, not 'postedBy'
    const jobs = await Job.find().populate("user", "name email"); 
    res.status(200).json(jobs);
});

/**
 * @desc Create a new job (Employer only)
 * @route POST /api/jobs
 * @access Private (Employer) - Role check now handled by middleware
 */
export const createJob = asyncHandler(async (req, res) => {
    // 💡 Updated destructuring to match Job.js model and simplify role check
    const { title, description, location, required_skills, salary_range } = req.body; 

    if (!title || !description || !required_skills) {
        res.status(400);
        throw new Error("Please include job title, description, and required skills.");
    }

    const job = new Job({
        title,
        description,
        // 💡 Use 'user' for consistency with model and req.user
        user: req.user._id, 
        // 💡 Added company field for dashboard/frontend display
        company: getCompanyName(req), 
        location,
        // 💡 Updated field name
        required_skills, 
        // 💡 Updated field name
        salary_range,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
});

/**
 * @desc Get jobs created by the logged-in employer (for dashboard)
 * @route GET /api/jobs/employer - (Or just /api/jobs if you only use the general GET for job seekers)
 * @access Private (Employer) - Role check now handled by middleware
 */
export const getEmployerJobs = asyncHandler(async (req, res) => {
    // 💡 Updated to find by the 'user' field, not 'postedBy'
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
});

/**
 * @desc Get a single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
export const getJobById = asyncHandler(async (req, res) => {
    // 💡 Updated to populate the 'user' field
    const job = await Job.findById(req.params.id).populate("user", "name email");

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    res.status(200).json(job);
});

/**
 * @desc Update a job (Employer only)
 * @route PUT /api/jobs/:id
 * @access Private (Employer)
 */
export const updateJob = asyncHandler(async (req, res) => {
    // 💡 Updated destructuring to match the Job model
    const { title, description, location, required_skills, salary_range, status } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    // ✅ Ownership Check (Updated field name: job.user)
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this job");
    }

    job.title = title ?? job.title;
    job.description = description ?? job.description;
    job.location = location ?? job.location;
    // 💡 Updated field name
    job.required_skills = required_skills ?? job.required_skills;
    // 💡 Updated field name
    job.salary_range = salary_range ?? job.salary_range;
    job.status = status ?? job.status;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
});

/**
 * @desc Delete a job (Employer only)
 * @route DELETE /api/jobs/:id
 * @access Private (Employer)
 */
export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    // ✅ Ownership Check (Updated field name: job.user)
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this job");
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job removed successfully" });
});

// export const getJobApplicants = asyncHandler(async (req, res) => {
//   const job = await Job.findById(req.params.id).populate("applicants", "name email cv coverLetter");

//   if (!job) {
//     res.status(404);
//     throw new Error("Job not found");
//   }

//   // Ensure only the owner employer can view applicants
//   if (job.user.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("Not authorized to view applicants for this job");
//   }

//   res.status(200).json({
//     jobTitle: job.title,
//     applicants: job.applicants || [],
//   });
// });


// Apply for a job
export const applyForJob = asyncHandler(async (req, res) => {
  const { name, email, coverLetter, cv } = req.body;
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Prevent duplicate applications from same email for the same job
  const alreadyApplied = await Applicant.findOne({ job: jobId, email });
  if (alreadyApplied) {
    res.status(400);
    throw new Error("You have already applied for this job.");
  }

  const applicant = await Applicant.create({
    job: jobId,
    name,
    email,
    coverLetter,
    cv,
    user: req.user ? req.user._id : null,
  });

  job.applicants.push(applicant._id);
  await job.save();

  res.status(201).json({
    message: "Application submitted successfully!",
    applicant,
  });
});


export const getJobApplicants = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // ✅ Find the job and ensure it belongs to the logged-in employer
  const job = await Job.findById(jobId).populate({
    path: "applicants",
    populate: { path: "user", select: "name email resume" }, // includes applicant user info
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // ✅ Only allow the employer who created the job to view applicants
  if (job.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view applicants for this job");
  }

  res.status(200).json({
    jobTitle: job.title,
    totalApplicants: job.applicants.length,
    applicants: job.applicants,
  });
});