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
    // ✅ NEW FIELD: Required for employers to post jobs
    company_name: {
        type: String,
        // Make it required *only* if the role is 'employer'
        required: function() {
            return this.role === 'employer';
        },
        trim: true,
    },
    // Future fields for JobSeekers (e.g., resume/skills) would go here
  },
  { timestamps: true }
);

// Encrypt password (Keep this logic)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password (Keep this logic)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);