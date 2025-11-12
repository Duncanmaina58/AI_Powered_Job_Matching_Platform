// frontend/src/pages/JobseekerDashboard/BrowseJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Search,
    Loader2,
    X,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// The component now relies solely on the darkMode prop for styling
export default function BrowseJobs({ darkMode }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
const navigate = useNavigate();
    // ❌ Removed all internal 'isDark' state and related useEffects.
    //    'darkMode' prop is used directly for all conditional styling.

    // ✅ Fetch jobs
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("❌ Failed to load job listings. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // 🔍 Filter jobs
    const filteredJobs = jobs.filter(
        (job) =>
            job.title?.toLowerCase().includes(search.toLowerCase()) ||
            job.company?.toLowerCase().includes(search.toLowerCase()) ||
            job.location?.toLowerCase().includes(search.toLowerCase())
    );

    // 📨 Submit Application
    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;
            if (!token) {
                setMessage("⚠️ Please log in to apply for jobs.");
                return;
            }

            const formData = new FormData();
            formData.append("name", userInfo.name);
            formData.append("email", userInfo.email);
            formData.append("coverLetter", coverLetter);
            if (cvFile) formData.append("cv", cvFile);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/jobs/${selectedJob._id}/apply`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(res.data.message || "✅ Application submitted!");
            setSelectedJob(null);
            setCoverLetter("");
            setCvFile(null);
        } catch (err) {
            console.error("Error submitting application:", err);
            setMessage("❌ Something went wrong. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper classes for better readability and to follow dark mode logic
    const darkClasses = {
        bg: darkMode ? "bg-gray-900" : "bg-gray-50",
        text: darkMode ? "text-gray-100" : "text-gray-800",
        cardBg: darkMode ? "bg-gray-800" : "bg-white",
        cardBorder: darkMode ? "border-gray-700" : "border-gray-100",
        subText: darkMode ? "text-gray-400" : "text-gray-500",
        inputBg: darkMode ? "bg-gray-800" : "bg-white",
        inputText: darkMode ? "text-gray-200" : "text-gray-700",
    };

    return (
        <div className={`min-h-screen p-8 ${darkClasses.bg} transition-colors duration-300`}>
            {/* 🔍 Search Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h1 className={`text-3xl font-bold ${darkClasses.text}`}>
                    Find Your Career — You Deserve It
                </h1>
                <div className={`flex items-center gap-2 ${darkClasses.inputBg} shadow-md px-3 py-2 rounded-xl w-full sm:w-80 border ${darkClasses.cardBorder}`}>
                    <Search className="text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, or locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`flex-1 outline-none text-sm ${darkClasses.inputText} bg-transparent`}
                    />
                </div>
            </div>

            {/* ⚠️ Status Messages */}
            {loading ? (
                <div className={`flex justify-center items-center py-10 ${darkClasses.subText}`}>
                    <Loader2 className="animate-spin mr-2" /> Loading jobs...
                </div>
            ) : error ? (
                <p className="text-center text-red-600">❌ {error}</p>
            ) : filteredJobs.length === 0 ? (
                <p className={`text-center ${darkClasses.subText}`}>No jobs found.</p>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job, i) => (
                        <div
                            key={job._id || i}
                            className={`${darkClasses.cardBg} border ${darkClasses.cardBorder} shadow-md hover:shadow-xl rounded-2xl p-6 transition transform hover:-translate-y-1`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} p-2 rounded-lg`}>
                                        <img
                                            src={
                                                job.logo ||
                                                `https://ui-avatars.com/api/?name=${job.company}&background=random`
                                            }
                                            alt={job.company}
                                            className="w-10 h-10 rounded-md object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${darkClasses.text} text-lg`}>
                                            {job.title}
                                        </h3>
                                        <p className={darkClasses.subText}>{job.company}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                                    {job.job_type || "Full Time"}
                                </span>
                            </div>

                            <div className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"} text-sm space-y-2`}>
                                <p className="flex items-center gap-2">
                                    <MapPin size={14} className={darkMode ? "text-blue-400" : "text-blue-500"} />{" "}
                                    {job.location || "Not specified"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <DollarSign size={14} className={darkMode ? "text-green-400" : "text-green-500"} />{" "}
                                    {job.salary_range?.min
                                        ? `$${job.salary_range.min.toLocaleString()}/month`
                                        : "$3500/month"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" /> 1 Day Ago
                                </p>
                            </div>

                   




<button
    onClick={() => navigate(`/apply-job/${job._id}`)}
    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium text-sm transition"
>
    Apply Now
</button>

                        </div>
                    ))}
                </div>
            )}

            {/* 🧾 Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 transition-colors">
                    <div className={`${darkClasses.cardBg} w-full max-w-lg rounded-2xl p-6 relative shadow-lg border ${darkClasses.cardBorder} transition-colors`}>
                        <button
                            onClick={() => setSelectedJob(null)}
                            className={`absolute top-3 right-3 ${darkClasses.subText} hover:text-red-500`}
                        >
                            <X size={20} />
                        </button>

                        <h3 className={`text-xl font-bold ${darkClasses.text} mb-2`}>
                            Apply for {selectedJob.title}
                        </h3>
                        <p className={`${darkClasses.subText} text-sm mb-4`}>
                            {selectedJob.company} • {selectedJob.location}
                        </p>

                        <form onSubmit={handleSubmitApplication} className="space-y-4">
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                required
                                placeholder="Write your cover letter..."
                                className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-lg px-3 py-2 text-sm ${darkClasses.inputText} focus:ring-2 focus:ring-blue-500`}
                                rows={4}
                            ></textarea>

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setCvFile(e.target.files[0])}
                                className={`w-full border ${darkClasses.cardBorder} bg-transparent rounded-lg px-3 py-2 text-sm ${darkClasses.inputText}`}
                            />

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