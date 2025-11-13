// frontend/src/pages/JobseekerDashboard/ApplyJob.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  ClipboardList,
  CheckCircle,
  FileText,
} from "lucide-react";

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
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 px-6 ${darkClasses.bg}`}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Job Details */}
        <div className={`md:col-span-2 ${darkClasses.cardBg} rounded-3xl shadow-lg border ${darkClasses.cardBorder} p-8`}>
          <div className="flex items-center gap-4 mb-6">
            <Briefcase className="text-blue-600" size={28} />
            <h1 className={`text-3xl font-bold ${darkClasses.text}`}>{job.title}</h1>
          </div>
          <div className="space-y-2 mb-6">
            <p className={`flex items-center gap-2 ${darkClasses.subText}`}>
              <Building2 size={16} /> {job.company}
            </p>
            <p className={`flex items-center gap-2 ${darkClasses.subText}`}>
              <MapPin size={16} /> {job.location}
            </p>
            <p className={`flex items-center gap-2 ${darkClasses.subText}`}>
              <DollarSign size={16} />{" "}
              {job.salary_range?.min
                ? `$${job.salary_range.min.toLocaleString()} - $${job.salary_range.max?.toLocaleString()}/month`
                : "Not specified"}
            </p>
            <p className={`flex items-center gap-2 ${darkClasses.subText}`}>
              <Calendar size={16} /> {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="border-t border-gray-300 my-6" />

          <section className="space-y-4">
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkClasses.text}`}>
              <FileText size={20} /> Job Description
            </h2>
            <p className={`${darkClasses.subText} text-sm leading-relaxed`}>
              {job.description || "No description provided."}
            </p>
          </section>

          {job.requirements && (
            <section className="space-y-3 mt-6">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkClasses.text}`}>
                <ClipboardList size={20} /> Requirements
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-500">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.responsibilities && (
            <section className="space-y-3 mt-6">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkClasses.text}`}>
                <CheckCircle size={20} /> Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-500">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Application Form */}
        <div className={`${darkClasses.cardBg} rounded-3xl shadow-lg border ${darkClasses.cardBorder} p-8`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${darkClasses.text}`}>Apply for this Job</h2>

          {message && (
            <p className="mb-4 text-center text-sm font-medium text-red-500">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmitApplication} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkClasses.text}`}>
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                placeholder="Write your cover letter..."
                rows={6}
                className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-xl px-4 py-3 text-sm ${darkClasses.inputText} focus:ring-2 focus:ring-blue-500 resize-none`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkClasses.text}`}>
                Upload CV (PDF/DOC/DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-xl px-4 py-3 text-sm ${darkClasses.inputText}`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center items-center gap-2 text-white font-semibold py-3 rounded-xl transition ${
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
    </div>
  );
}
