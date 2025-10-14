// Backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "employer"],
      default: "jobseeker",
      required: true,
    },

    // ✅ Employer-only field
    company_name: {
      type: String,
      required: function () {
        return this.role === "employer";
      },
      trim: true,
    },

    // ✅ Jobseeker profile fields
    profileImage: {
      type: String, // store image URL (e.g., from upload folder or Cloudinary)
      default: "",
    },
    bio: { 
        type: String },



    resume: {
      type: String, // path or URL to uploaded resume
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application", // referencing applications made by user
      },
    ],
  },
  { timestamps: true }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
