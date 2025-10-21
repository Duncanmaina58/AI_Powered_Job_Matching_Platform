import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    required_skills: "",
    salary_min: "",
    salary_max: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true); // start as true while fetching
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch the existing job details from backend
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setMessage("❌ Authorization token missing. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const job = res.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          company: job.company || "",
          location: job.location || "",
          required_skills: job.required_skills
            ? job.required_skills.join(", ")
            : "",
          salary_min: job.salary_range?.min || "",
          salary_max: job.salary_range?.max || "",
          status: job.status || "Active",
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch job details:", err);
        setMessage("❌ Could not fetch job details. Please try again later.");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        setMessage("❌ Authorization token missing. Please log in again.");
        setSaving(false);
        return;
      }

      const updatedData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        required_skills: formData.required_skills
          .split(",")
          .map((skill) => skill.trim()),
        salary_range: {
          min: Number(formData.salary_min),
          max: Number(formData.salary_max),
        },
        status: formData.status,
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Job updated successfully!");
      setTimeout(() => navigate("/employer/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Update failed:", err);
      setMessage(
        err.response?.data?.message ||
          "❌ Failed to update job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 text-gray-600 text-lg">
        ⏳ Loading job details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Job</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 text-sm rounded-lg ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Min Salary (KSH)
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Max Salary (KSH)
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium transition hover:bg-blue-700 ${
              saving && "opacity-70 cursor-not-allowed"
            }`}
          >
            {saving ? "Updating..." : "Update Job"} <Save size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
