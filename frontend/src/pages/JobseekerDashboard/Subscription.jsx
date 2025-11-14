import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Subscription({ darkMode }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const bgClasses = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textClasses = darkMode ? "text-gray-100" : "text-gray-900";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const cardBorder = darkMode ? "border-gray-700" : "border-gray-200";

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscription/plans`);
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Subscribe to a plan
  const handleSubscribe = async (tier) => {
  if (!userId) {
    setMessage("⚠️ Please login to subscribe.");
    return;
  }

  setSubmitting(true);
  setMessage("");

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/subscription/create-checkout-session`,
      { userId, tier },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Redirect to Stripe Checkout
    window.location.href = res.data.url;
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to start payment. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 ${bgClasses}`}>
      <h1 className={`text-3xl font-bold text-center mb-8 ${textClasses}`}>Choose Your Subscription Plan</h1>

      {message && (
        <div className="max-w-2xl mx-auto mb-6 text-center p-4 rounded-xl bg-blue-100 text-blue-800">
          {message}
        </div>
      )}

      {loading ? (
        <p className={`text-center ${textClasses}`}>Loading plans...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${cardBg} border ${cardBorder} rounded-3xl shadow-lg p-6 flex flex-col justify-between`}
            >
              <div>
                <h2 className={`text-xl font-bold mb-2 ${textClasses}`}>{plan.tier}</h2>
                <p className={`text-2xl font-extrabold mb-4 ${textClasses}`}>{plan.price === 0 ? "Free" : `$${plan.price}/mo`}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400">
                      <Check size={16} className="text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.tier)}
                disabled={submitting}
                className={`w-full py-2 rounded-xl font-semibold text-white transition ${
                  submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Processing..." : "Subscribe"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
