import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react";

const Overview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setError("⚠️ Please log in to view your dashboard.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/jobseeker/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats([
          { title: "Active Applications", value: data.activeApplications },
          { title: "Jobs Matched", value: data.matchedJobs },
          { title: "Messages", value: data.messages },
          { title: "Profile Completion", value: data.profileCompletion },
        ]);
      } catch (err) {
        console.error("Error fetching jobseeker stats:", err);
        setError("❌ Failed to load your dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 🌀 Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center text-gray-600">
          <Loader2 className="animate-spin mb-3 text-blue-600" size={36} />
          <p>Fetching your dashboard data...</p>
        </div>
      </div>
    );
  }

  // ⚠️ Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle size={36} className="mb-2" />
        <p className="text-center text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  // 📊 Dashboard stats UI
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all text-center border border-gray-100"
          >
            <h3 className="text-gray-500 font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stat.value !== undefined ? stat.value : "--"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
