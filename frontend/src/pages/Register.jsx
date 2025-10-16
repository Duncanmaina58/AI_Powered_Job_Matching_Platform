// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company_name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Only include company_name if role is employer
      const payload = { ...formData };
      if (formData.role !== "employer") delete payload.company_name;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, payload);

      if (res.data) {
        setSuccess("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-3 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="jobseeker">Jobseeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Show company name only if Employer is selected */}
          {formData.role === "employer" && (
            <div>
              <label className="block font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                placeholder="e.g., TechCorp Ltd"
                value={formData.company_name}
                onChange={handleChange}
                required={formData.role === "employer"}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline font-medium"
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
