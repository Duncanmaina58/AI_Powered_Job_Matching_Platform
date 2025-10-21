import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";

const AIMatch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

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

        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/ai-match`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs(data);
      } catch (err) {
        console.error("Error fetching AI-matched jobs:", err);
        setError("❌ Failed to load AI job matches. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAIMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={36} />
        <p>Analyzing your profile and finding the best matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle size={36} className="mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-700">
          AI Recommended Jobs for You
        </h2>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No AI matches found yet. Try updating your skills!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 p-6 transition-all"
            >
              <h3 className="text-lg font-semibold text-blue-700">{job.title}</h3>
              <p className="text-gray-500 text-sm">{job.company_name}</p>
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">{job.description}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  Match: {job.matchScore || 0}%
                </span>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧩 Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedJob.title}</h3>
            <p className="text-gray-500">{selectedJob.company_name}</p>
            <p className="mt-4 text-gray-600">{selectedJob.description}</p>

            <div className="mt-4">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Match: {selectedJob.matchScore}%
              </span>
            </div>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium w-full">
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatch;
