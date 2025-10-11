import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Applicant name is required"],
    },
    email: {
      type: String,
      required: [true, "Applicant email is required"],
    },
    cv: {
      type: String, // URL or path to uploaded CV
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional in case applicant isn't registered
    },
  },
  { timestamps: true }
);

export default mongoose.model("Applicant", applicantSchema);
