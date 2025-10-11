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
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/jobs/employer", {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Job Posts</h1>

      {loading ? (
        <p className="text-gray-500 text-center mt-10">Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-10">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No jobs posted yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>

              <div className="space-y-2 text-gray-600 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" /> {job.company}
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
                      View <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Applicant List */}
              {expandedJob === job._id && job.applicants?.length > 0 && (
                <div className="mt-3 border-t pt-2 max-h-48 overflow-y-auto">
                  {job.applicants.map((app, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start py-2 border-b last:border-0 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{app.name}</p>
                        <p className="text-gray-600 text-xs">{app.email}</p>
                        {app.coverLetter && (
                          <p className="text-gray-700 text-xs mt-1 italic line-clamp-2">
                            “{app.coverLetter.slice(0, 80)}...”
                          </p>
                        )}
                        {app.cv && (
                          <a
                            href={app.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs mt-1"
                          >
                            <FileText size={14} /> View CV
                          </a>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
