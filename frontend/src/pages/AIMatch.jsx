import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle, Sparkles, Building2, MapPin, Clock, Bookmark } from "lucide-react";

// Component now accepts the darkMode prop
const AIMatch = ({ darkMode }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [saving, setSaving] = useState(false);

    // Dark Mode Class Definitions
    const bgClass = darkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white";
    const contentBgClass = darkMode ? "bg-gray-800" : "bg-white";
    const borderClass = darkMode ? "border-gray-700" : "border-gray-100";
    const textPrimaryClass = darkMode ? "text-gray-100" : "text-gray-800";
    const textSecondaryClass = darkMode ? "text-gray-400" : "text-gray-600";
    const modalBgClass = darkMode ? "bg-gray-800" : "bg-white";

useEffect(() => {
    const fetchAIMatches = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            if (!token) {
                setError("⚠️ Please log in to view your AI job matches.");
                setLoading(false);
                return;
            }

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/ai/match/jobs`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("AI Match response:", data); // 👀 For debugging

            // ✅ Extract the array correctly
            setJobs(data.matched_jobs || []);
        } catch (err) {
            console.error("Error fetching AI-matched jobs:", err);
            setError("❌ Failed to load AI job matches. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    fetchAIMatches();
}, []);

    const handleSaveJob = async (jobId) => {
        try {
            setSaving(true);
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/jobseeker/save-job`,
                { jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // You might want to update the job list to mark the job as saved here
            alert("✅ Job saved to your favorites!");
        } catch (error) {
            console.error("Error saving job:", error);
            alert("⚠️ Could not save job. Try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className={`flex flex-col items-center justify-center h-64 ${textSecondaryClass}`}>
                <Loader2 className="animate-spin text-blue-600 mb-2" size={36} />
                <p>Analyzing your profile and finding the best matches...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertCircle size={36} className="mb-2" />
                <p>{error}</p>
            </div>
        );

    return (
        <div className={`p-6 min-h-screen ${bgClass} transition-colors duration-300`}>
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-blue-600" size={28} />
                <h2 className={`text-3xl font-bold ${textPrimaryClass}`}>
                    AI Recommended Jobs for You
                </h2>
            </div>

            {jobs.length === 0 ? (
                <p className={`${textSecondaryClass} text-center mt-10`}>
                    No AI matches found yet. Try updating your skills and experience!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className={`${contentBgClass} rounded-xl shadow-sm hover:shadow-xl border ${borderClass} p-6 transition-all group`}
                        >
                            <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-500">
                                {job.title}
                            </h3>
                            <div className={`flex items-center text-sm ${textSecondaryClass} mt-1`}>
                                <Building2 size={14} className="mr-1 text-blue-500" />
                                {job.company_name}
                            </div>
                            <div className={`flex items-center text-sm ${textSecondaryClass} mt-1`}>
                                <MapPin size={14} className="mr-1 text-blue-500" />
                                {job.location || "Remote"}
                            </div>
                            <div className={`flex items-center text-sm ${textSecondaryClass} mt-1`}>
                                <Clock size={14} className="mr-1 text-blue-500" />
                                Posted {job.postedAgo || "recently"}
                            </div>

                            <p className={`mt-3 text-sm ${textSecondaryClass} line-clamp-3`}>
                                {job.description}
                            </p>

                            <div className="flex justify-between items-center mt-5">
                                <span
                                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                                        job.matchScore >= 80
                                            ? "bg-green-600/20 text-green-400" // Dark mode green
                                            : job.matchScore >= 60
                                                ? "bg-yellow-600/20 text-yellow-400" // Dark mode yellow
                                                : "bg-gray-600/20 text-gray-400" // Dark mode gray
                                    } ${
                                        !darkMode && // Light mode overrides
                                        (job.matchScore >= 80
                                            ? "bg-green-100 text-green-600"
                                            : job.matchScore >= 60
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-gray-100 text-gray-600")
                                    }`}
                                >
                                    Match: {job.matchScore || 0}%
                                </span>

                                <button
                                    onClick={() => setSelectedJob(job)}
                                    className="text-sm text-blue-600 hover:text-blue-400 hover:underline transition"
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className={`${modalBgClass} rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn ${borderClass} border`}>
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-red-500"
                        >
                            ✕
                        </button>

                        <h3 className={`text-2xl font-bold ${textPrimaryClass} mb-1`}>
                            {selectedJob.title}
                        </h3>
                        <p className={`${textSecondaryClass} mb-4`}>{selectedJob.company_name}</p>
                        <p className={`${textSecondaryClass} leading-relaxed`}>
                            {selectedJob.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                                Match: {selectedJob.matchScore}%
                            </span>
                            {selectedJob.skillsMatched && (
                                <span className="text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                                    Skills matched: {selectedJob.skillsMatched.join(", ")}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium w-full transition"
                                onClick={() => alert("✅ Applied successfully!")}
                            >
                                Apply Now
                            </button>

                            <button
                                disabled={saving}
                                onClick={() => handleSaveJob(selectedJob._id)}
                                className={`border ${darkMode ? "border-gray-600 hover:bg-gray-700 text-gray-200" : "border-gray-300 hover:bg-gray-100 text-gray-700"} px-5 py-2 rounded-lg font-medium w-full transition flex items-center justify-center gap-2`}
                            >
                                {saving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Bookmark size={16} />
                                )}
                                {saving ? "Saving..." : "Save Job"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIMatch;