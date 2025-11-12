import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

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
      const payload = { ...formData };
      if (formData.role !== "employer") delete payload.company_name;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        payload
      );

      if (res.data) {
        setSuccess("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 animate-gradient-slow"></div>

      {/* Overlay for subtle darkening */}
      <div className="absolute inset-0 bg-black/25"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md z-10 backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-center animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-3 text-center animate-fade-in">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <div>
            <label className="block font-medium mb-1">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
            >
              <option value="jobseeker">Jobseeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {formData.role === "employer" && (
            <InputField
              label="Company Name"
              name="company_name"
              type="text"
              placeholder="e.g., TechCorp Ltd"
              value={formData.company_name}
              onChange={handleChange}
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
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
      </motion.div>

      {/* Animations for gradient */}
      <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Reusable input field component
const InputField = ({ label, name, type, placeholder, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition duration-300"
    />
  </div>
);

export default Register;
