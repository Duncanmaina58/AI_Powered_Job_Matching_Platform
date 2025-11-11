// client/src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Store token temporarily
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user info immediately
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;

        // ✅ unify with normal login format
        const unifiedData = {
          token: token,
          ...user, // includes _id, name, email, role, etc.
        };

        localStorage.setItem("userInfo", JSON.stringify(unifiedData));
        localStorage.setItem("user", JSON.stringify(user)); // optional backup

        // ✅ redirect based on role
        if (user.role === "employer") {
          navigate("/employer/dashboard");
        } else {
          navigate("/jobseeker/dashboard");
        }
      })
      .catch((err) => {
        console.error("Google Auth Error:", err);
        navigate("/login");
      });
  }, [token, navigate]);

  return <p>Authenticating via Google...</p>;
}
