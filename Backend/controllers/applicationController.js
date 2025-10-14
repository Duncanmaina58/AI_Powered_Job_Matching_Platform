// Backend/controllers/applicationController.js
import Applicant from "../models/Applicant.js";

// ✅ Update application status (Accept / Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};