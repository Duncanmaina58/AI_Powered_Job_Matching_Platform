import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Briefcase, Crown } from "lucide-react"; // ✅ nice clean icons

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company_name: "",
    subscriptionTier: "Free",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        form
      );
      setSuccess("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  // Subscription plan data
  const plans = [
    {
      name: "Free",
      price: "$0 / month",
      icon: <Briefcase size={32} className="text-gray-500 mx-auto mb-2" />,
      color: "border-gray-300",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "Apply up to 10 jobs / month",
        "Basic profile visibility",
        "Limited messaging access",
      ],
    },
    {
      name: "Premium Basic",
      price: "$9.99 / month",
      icon: <Star size={32} className="text-blue-500 mx-auto mb-2" />,
      color: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      features: [
        "Unlimited job applications",
        "Priority job listing visibility",
        "Custom profile themes",
      ],
    },
    {
      name: "Premium Pro",
      price: "$19.99 / month",
      icon: <Crown size={32} className="text-yellow-500 mx-auto mb-2" />,
      color: "border-yellow-500",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      features: [
        "All Premium Basic features",
        "1-on-1 recruiter support",
        "Job insights & analytics",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      {/* LEFT SIDE - Subscription Plans */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex flex-col items-center mb-10 lg:mb-0"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`relative border-2 ${plan.color} p-6 rounded-2xl shadow-lg bg-white cursor-pointer transition ${
                form.subscriptionTier === plan.name ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setForm({ ...form, subscriptionTier: plan.name })}
            >
              {plan.icon}
              <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
              <p className="text-blue-600 font-bold text-lg mb-2">{plan.price}</p>
              <ul className="text-gray-600 text-sm space-y-1 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <button
                className={`w-full text-white py-2 rounded-lg font-medium ${plan.buttonColor} transition`}
              >
                {plan.name === form.subscriptionTier ? "Selected" : "Select Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT SIDE - Original Register Form */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-center mb-3">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-600 p-2 rounded text-center mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Register as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="jobseeker">Jobseeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {form.role === "employer" && (
            <Input
              label="Company Name"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
            />
          )}

          {/* Read-only plan display */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Selected Plan
            </label>
            <input
              readOnly
              value={form.subscriptionTier}
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
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
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
