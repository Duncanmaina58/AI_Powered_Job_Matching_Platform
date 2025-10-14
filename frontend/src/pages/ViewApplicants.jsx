import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
} from "lucide-react";

const ViewApplicants = () => {
  const { jobId } = useParams(); // 👈 Get job ID from the route
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch applicants for a specific job
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/jobs/${jobId}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplicants(response.data.applicants || response.data);
        setJobTitle(response.data.job?.title || "Job Applicants");
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setMessage("Unable to load applicants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId, token]);

  // ✅ Accept or Reject applicant
  // ✅ Corrected version
// ✅ Accept or Reject applicant
const handleApplicantAction = async (applicantId, action) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please log in again to perform this action.");
      return;
    }

    await axios.put(
      `http://localhost:5000/api/applications/${applicantId}/status`,
      { status: action }, // the backend expects this key
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update UI instantly
    setApplicants((prev) =>
      prev.map((a) =>
        a._id === applicantId ? { ...a, status: action } : a
      )
    );

    alert(`✅ Applicant ${action} successfully!`);
  } catch (error) {
    console.error("Error updating applicant status:", error);
    alert("❌ Failed to update applicant status. Please try again.");
  }
};


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600" size={26} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
          <p className="text-gray-500 text-sm">{jobTitle}</p>
        </div>
      </div>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <FileText className="mx-auto mb-3 text-gray-400" size={36} />
          <p>No applicants for this job yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Cover Letter</th>
                <th className="py-3 px-4 text-left">CV</th>
                <th className="py-3 px-4 text-left">Date Applied</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a) => (
                <tr key={a._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{a.name}</td>
                  <td className="py-3 px-4">{a.email}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-gray-700">
                    {a.coverLetter}
                  </td>
                  <td className="py-3 px-4">
                    {a.cvUrl ? (
                      <a
                        href={a.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Download size={16} /> CV
                      </a>
                    ) : (
                      <span className="text-gray-400">No CV</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : a.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status || "pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleApplicantAction(a._id, "accepted")}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-xs"
                    >
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button
                      onClick={() => handleApplicantAction(a._id, "rejected")}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;
