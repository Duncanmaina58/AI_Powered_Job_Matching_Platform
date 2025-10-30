// Backend/models/Job.js

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // 🔑 Employer who created this job
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // 📋 Basic Job Information
    title: {
      type: String,
      required: [true, "Please add a job title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a job description"],
    },

    // 🏢 Company & Location Info
    company: {
      type: String,
      required: [true, "Please add the company name for this job post"],
    },
    location: {
      type: String,
      required: [true, "Please add the job location"],
      default: "Remote",
    },

    // 🧠 Skills & AI Matching Fields
    required_skills: {
      type: [String],
      required: [true, "Please list required skills for the AI matcher"],
    
    },



    // 💰 Salary Range
    salary_range: {
      type: {
        min: Number,
        max: Number,
      },
      required: false,
    },

    // 📊 Job Status
    status: {
      type: String,
      enum: ["Active", "Closed", "Filled"],
      default: "Active",
    },

    // 🧾 Applicants Tracking (Linked to Applicant model)
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
