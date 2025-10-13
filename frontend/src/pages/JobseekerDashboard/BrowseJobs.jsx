// frontend/src/pages/JobseekerDashboard/BrowseJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Bookmark,
  Search,
  Loader2,
  X,
} from "lucide-react";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch all jobs
 const fetchJobs = async () => {
  setLoading(true);
  try {
    const res = await axios.get("http://localhost:5000/api/jobs");
    setJobs(res.data);
  } catch (err) {
    console.error("Error fetching jobs:", err); // ✅ Use err to fix ESLint warning
    setError("❌ Failed to load job listings. Try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchJobs();
  }, []);

  // 🔍 Filter by search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase())
  );

  // 📨 Apply with modal submission
  const handleSubmitApplication = async (e) => {
  e.preventDefault();
  setMessage("");
  setSubmitting(true);

  try {
    // ✅ Get token directly
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!token || !userInfo) {
      setMessage("⚠️ Please log in to apply for jobs.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("email", userInfo.email);
    formData.append("coverLetter", coverLetter);
    if (cvFile) formData.append("cv", cvFile);

    const res = await axios.post(
      `http://localhost:5000/api/jobs/${selectedJob._id}/apply`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage(res.data.message || "✅ Application submitted successfully!");
    setSelectedJob(null);
    setCoverLetter("");
    setCvFile(null);
  } catch (err) {
    console.error("Application error:", err);
    if (err.response?.data?.message)
      setMessage(`❌ ${err.response.data.message}`);
    else setMessage("❌ Something went wrong. Try again.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="bg-gray-50 min-h-screen p-6 relative">
      {/* 🔍 Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-3 sm:mb-0">
          Browse Jobs
        </h2>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border w-full sm:w-80">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
          />
        </div>
      </div>

      {/* ✅ Message */}
      {message && (
        <div
          className={`mb-4 text-center py-2 rounded-lg text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : message.includes("⚠️")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* 📦 Job List */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading jobs...
        </div>
      ) : error ? (
        <p className="text-center text-red-600 py-10">{error}</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-center text-gray-600 py-10">No jobs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h3>
                <button
                  className="text-gray-400 hover:text-blue-600 transition"
                  title="Save job"
                >
                  <Bookmark size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Building2 size={15} className="text-blue-500" />{" "}
                {job.company || "Unknown company"}
              </p>

              <div className="mt-3 space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />{" "}
                  {job.location || "Not specified"}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  {job.salary_range?.min && job.salary_range?.max
                    ? `KSH ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}`
                    : "Negotiable"}
                </p>
              </div>

              <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                {job.description || "No description provided."}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    job.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.status || "Pending"}
                </span>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-white bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5 rounded-lg transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧾 Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedJob(null)}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Apply for {selectedJob.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedJob.company} • {selectedJob.location}
            </p>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a short cover letter..."
                  className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CV (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="w-full text-sm text-gray-700 border rounded-lg px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-lg ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Submitting...
                  </>
                ) : (
                  <>
                    <Briefcase size={18} /> Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
