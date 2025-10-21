import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, Mail, FileText, Loader2 } from "lucide-react";

export default function ApplicantsPage() {
  const { id } = useParams(); // Job ID from URL
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authorized. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplicants(res.data.applicants || []);
        setJobTitle(res.data.jobTitle || "Job Applicants");
      } catch (err) {
        console.error("❌ Failed to fetch applicants:", err);
        setError("Could not fetch applicants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-3">
            Applicants for: <span className="text-blue-600">{jobTitle}</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="ml-2 text-gray-500">Loading applicants...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-10">{error}</p>
      ) : applicants.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No applicants yet for this job.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div
              key={applicant._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <User size={22} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {applicant.name}
                </h3>
              </div>

              <p className="flex items-center gap-2 text-gray-600 mb-2">
                <Mail size={16} className="text-red-500" />
                {applicant.email}
              </p>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {applicant.coverLetter || "No cover letter provided."}
              </p>

              {applicant.cv ? (
                <a
                  href={applicant.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <FileText size={16} />
                  View CV
                </a>
              ) : (
                <p className="text-gray-500 text-sm italic">No CV uploaded</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
