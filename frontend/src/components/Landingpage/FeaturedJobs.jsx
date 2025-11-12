import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedJobsSection() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        // Sort by newest and pick top 6
        const latestJobs = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setJobs(latestJobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("❌ Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-20 bg-gray-50" id="jobs">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Featured <span className="text-blue-600">Job Listings</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-12"
        >
          Explore top job openings curated just for you.
        </motion.p>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No jobs found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition-all border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      job.logo ||
                      `https://ui-avatars.com/api/?name=${job.company}&background=random`
                    }
                    alt={job.company}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {job.title}
                    </h4>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                  </div>
                </div>

                <div className="text-left text-gray-600 space-y-2 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {job.location || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase size={16} className="text-green-500" />
                    {job.job_type || "Full-Time"}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign size={16} className="text-yellow-500" />
                    {job.salary_range?.min && job.salary_range?.max
                      ? `KSH ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}`
                      : "Not specified"}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/ApplyJob/${job._id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
