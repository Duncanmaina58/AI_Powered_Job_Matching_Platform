import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Google from "../assets/google-icon.jpg";
import Microsoft from "../assets/microsoft-icon2.jpg";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        { email, password, role }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.token) localStorage.setItem("token", data.token);

      if (data.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect to backend for Google login
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  // ✅ Redirect to backend for Microsoft login
  const handleMicrosoftLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/microsoft`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 text-center rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-gray-700 mb-1">Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="jobseeker">JobSeeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-px bg-gray-300 w-1/3"></div>
          <span className="mx-3 text-gray-500">OR</span>
          <div className="h-px bg-gray-300 w-1/3"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <img src={Google} alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <img src={Microsoft} alt="Microsoft" className="w-5 h-5" />
            Continue with Microsoft
          </button>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
