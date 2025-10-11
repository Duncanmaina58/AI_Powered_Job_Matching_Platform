import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Users, Briefcase } from "lucide-react";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  // Simulate job fetching from backend
  useEffect(() => {
    const fakeJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Fintech Group Kenya",
        location: "Nairobi, Kenya",
        applicants: 8,
        status: "Active",
      },
      {
        id: 2,
        title: "Backend Engineer",
        company: "Fintech Group Kenya",
        location: "Muranga, Kenya",
        applicants: 4,
        status: "Closed",
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "Fintech Group Kenya",
        location: "Remote",
        applicants: 12,
        status: "Active",
      },
    ];
    setJobs(fakeJobs);
  }, []);

  const handleEdit = (id) => {
    alert(`✏️ Edit job with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const handleViewApplicants = (id) => {
    alert(`👥 Viewing applicants for Job ID: ${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <Briefcase className="text-blue-600" /> Manage My Jobs
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {job.company} • {job.location}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    job.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  Status: {job.status}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewApplicants(job.id)}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition"
                >
                  <Users size={16} /> {job.applicants}
                </button>

                <button
                  onClick={() => handleEdit(job.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
