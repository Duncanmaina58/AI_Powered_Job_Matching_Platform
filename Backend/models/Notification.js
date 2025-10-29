import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    message: { type: String, required: true },
    type: { type: String, default: "info" }, // info, success, warning, error
    data: { type: Object }, // extra info (jobId, applicantId, etc.)
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
