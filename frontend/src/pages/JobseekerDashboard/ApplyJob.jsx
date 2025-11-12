// frontend/src/pages/JobseekerDashboard/ApplyJob.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Briefcase, Calendar, MapPin, DollarSign } from "lucide-react";

export default function ApplyJob({ darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const darkClasses = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    text: darkMode ? "text-gray-100" : "text-gray-800",
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border-gray-200",
    subText: darkMode ? "text-gray-400" : "text-gray-500",
    inputText: darkMode ? "text-gray-200" : "text-gray-700",
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      if (!token) {
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
        `${import.meta.env.VITE_API_URL}/api/jobs/${id}/apply`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "✅ Application submitted!");
      setCoverLetter("");
      setCvFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkClasses.bg} ${darkClasses.text}`}>
        <Loader2 className="animate-spin mr-2" /> Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`flex flex-col justify-center items-center h-screen ${darkClasses.bg} ${darkClasses.text}`}>
        <p>{message || "Job not found."}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkClasses.bg} flex justify-center`}>
      <div className="max-w-3xl w-full space-y-10">
        {/* Job Details Card */}
        <div className={`${darkClasses.cardBg} rounded-3xl shadow-xl border ${darkClasses.cardBorder} p-8`}>
          <h1 className={`text-3xl font-bold mb-4 text-center ${darkClasses.text}`}>{job.title}</h1>
          <p className={`text-center ${darkClasses.subText} mb-6`}>
            {job.company} • {job.location} • <span className="font-medium">{job.job_type || "Full Time"}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <h3 className={`font-semibold ${darkClasses.text}`}>Location</h3>
              <p className={`${darkClasses.subText} flex items-center gap-2`}><MapPin size={16} /> {job.location || "Not specified"}</p>
            </div>
            <div className="flex flex-col">
              <h3 className={`font-semibold ${darkClasses.text}`}>Salary</h3>
              <p className={`${darkClasses.subText} flex items-center gap-2`}>
                <DollarSign size={16} /> 
                {job.salary_range?.min
                  ? `$${job.salary_range.min.toLocaleString()} - $${job.salary_range.max?.toLocaleString()}/month`
                  : "Not specified"}
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className={`font-semibold ${darkClasses.text}`}>Posted Date</h3>
              <p className={`${darkClasses.subText} flex items-center gap-2`}><Calendar size={16} /> {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col">
              <h3 className={`font-semibold ${darkClasses.text}`}>Job Type</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"
              }`}>{job.job_type || "Full Time"}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold text-lg mb-2 ${darkClasses.text}`}>Job Description</h3>
            <p className={`${darkClasses.subText} text-sm whitespace-pre-line`}>{job.description || "No description provided."}</p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className={`font-semibold text-lg mb-2 ${darkClasses.text}`}>Requirements</h3>
              <ul className={`${darkClasses.subText} list-disc pl-5 space-y-1 text-sm`}>
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && (
            <div>
              <h3 className={`font-semibold text-lg mb-2 ${darkClasses.text}`}>Responsibilities</h3>
              <ul className={`${darkClasses.subText} list-disc pl-5 space-y-1 text-sm`}>
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Application Form Card */}
        <div className={`${darkClasses.cardBg} rounded-3xl shadow-xl border ${darkClasses.cardBorder} p-8`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${darkClasses.text}`}>Apply for this Job</h2>
          {message && <p className="mb-4 text-center text-red-500">{message}</p>}

          <form onSubmit={handleSubmitApplication} className="space-y-5">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              placeholder="Write your cover letter..."
              className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-xl px-4 py-3 text-sm ${darkClasses.inputText} focus:ring-2 focus:ring-blue-500 resize-none`}
              rows={6}
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-xl px-4 py-3 text-sm ${darkClasses.inputText}`}
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center items-center gap-2 text-white font-semibold py-3 rounded-xl transition ${
                submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
    </div>
  );
}
