import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  Bookmark,
  BarChart3,
} from "lucide-react";

const AIMatch = ({ darkMode }) => {
  const [jobs, setJobs] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const bgClass = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gradient-to-b from-blue-50 to-white text-gray-900";

  useEffect(() => {
    const fetchAIStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setError("⚠️ Please log in to view your AI job matches.");
          setLoading(false);
          return;
        }

        // Fetch both AI matches and stats
        const [aiRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/ai/match/jobs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setJobs(aiRes.data.matched_jobs || []);
        setMatchedCount(statsRes.data.matchedJobs || 0);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load AI job matches or stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchAIStats();
  }, []);

  const handleSaveJob = async (jobId) => {
    try {
      setSaving(true);
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobseeker/save-job`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Job saved successfully!");
    } catch {
      alert("⚠️ Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
        <p>Analyzing your profile and finding the best job matches...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-red-500">
        <AlertCircle size={36} className="mb-2" />
        <p>{error}</p>
      </div>
    );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      {/* Hero Section */}
      <section className="text-center py-16 px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="mx-auto text-blue-600 mb-4" size={40} />
          <h1 className="text-4xl lg:text-5xl font-extrabold">
            Your AI Job Matches
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Smart recommendations powered by AI to match your skills and goals
            with the right opportunities.
          </p>

          <div className="mt-10 flex justify-center items-center gap-3 bg-white dark:bg-gray-800 border rounded-2xl shadow px-6 py-3 max-w-fit mx-auto">
            <BarChart3 className="text-blue-600" />
            <span className="font-semibold">
              Total Jobs Matched:{" "}
              <span className="text-blue-600">{matchedCount}</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Job Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-20 pb-20"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {jobs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No matches found. Update your skills to get better recommendations.
          </p>
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl border shadow hover:shadow-lg transition-all p-6 cursor-pointer ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-blue-600">
                  {job.title}
                </h3>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    job.matchScore >= 80
                      ? "bg-green-100 text-green-600"
                      : job.matchScore >= 60
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {job.matchScore || 0}% Match
                </span>
              </div>

              <p className="text-gray-500 mt-2 flex items-center text-sm">
                <Building2 size={14} className="mr-1" /> {job.company_name}
              </p>
              <p className="text-gray-500 flex items-center text-sm">
                <MapPin size={14} className="mr-1" /> {job.location || "Remote"}
              </p>
              <p className="text-gray-500 flex items-center text-sm">
                <Clock size={14} className="mr-1" />{" "}
                {job.postedAgo || "Recently"}
              </p>

              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                {job.description}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("✅ Applied successfully!");
                  }}
                >
                  Apply Now
                </button>
                <button
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveJob(job._id);
                  }}
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Bookmark size={14} />
                  )}
                  Save
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AIMatch;
