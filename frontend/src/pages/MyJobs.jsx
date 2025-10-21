// frontend/src/pages/EmployerDashboard/MyJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Pencil,
  MapPin,
  Building2,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);
  const navigate = useNavigate();

  // Fetch employer's jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/employer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch employer jobs:", err);
        setError("❌ Could not fetch your job listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  // Navigate to view applicants page
  const handleViewApplicants = (jobId) => {
    navigate(`/employer/jobs/${jobId}/applicants`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My Job Posts
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center mt-10">Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-10">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No jobs posted yet. Create your first job to start hiring!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border relative"
            >
              {/* Job Header */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="space-y-2 text-gray-600 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" />{" "}
                  {job.company}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" /> {job.location}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  {job.salary_range?.min && job.salary_range?.max
                    ? `KSH ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>

              {/* Applicants summary */}
              <div className="border-t pt-3 mt-3 text-sm text-gray-700 flex justify-between items-center">
                <p className="flex items-center gap-1">
                  <Users size={16} className="text-blue-500" />{" "}
                  {job.applicants?.length || 0} Applicants
                </p>

                <button
                  onClick={() =>
                    setExpandedJob(expandedJob === job._id ? null : job._id)
                  }
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {expandedJob === job._id ? (
                    <>
                      Hide <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Expand <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>

              {/* Expanded applicant info */}
              {expandedJob === job._id && (
                <div className="mt-4 border-t pt-3 flex justify-between items-center">
                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                  >
                    <Users size={16} /> View Applicants
                  </button>
                  <button
                    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
