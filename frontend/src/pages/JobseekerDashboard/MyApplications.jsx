import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/jobs/jobseeker/applications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Unable to load your applications. Please try again later.");
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to withdraw this application?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/jobs/jobseeker/applications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from UI without refreshing
      setApplications((prev) => prev.filter((app) => app._id !== id));
      alert("Application withdrawn successfully!");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      alert("Failed to withdraw application. Please try again.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading your applications...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            You haven’t applied for any jobs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {app.job?.title || "Untitled Job"}
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Company:</span>{" "}
                  {app.job?.company || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Location:</span>{" "}
                  {app.job?.location || "Not specified"}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Applied On:</span>{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        window.open(app.cv, "_blank", "noopener,noreferrer")
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View CV
                    </button>

                    {app.status === "Pending" && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
