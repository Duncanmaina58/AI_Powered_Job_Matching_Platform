import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function SubscriptionUpgrade({ user }) {
  const [plans, setPlans] = useState([]);
  const [currentPlan, ] = useState(user?.subscription?.tier || "Free");
  const [loading, ] = useState(false);
  const [message, ] = useState("");

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscription/plans`);
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    fetchPlans();
  }, []);

const handleUpgrade = (plan) => {
  if (plan.tier === currentPlan) return;

  // Your real Stripe Payment Link
  const paymentLink = "https://buy.stripe.com/test_fZu3cxcsbgnucQXeVK3Ru00";

  window.location.href = paymentLink;
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[80vh] p-6"
    >
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Upgrade Your Plan</h2>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Choose a subscription that matches your career goals and get access to exclusive job opportunities.
      </p>

      {message && <p className="mb-6 text-center font-medium">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`border rounded-2xl shadow-lg p-6 flex flex-col justify-between transition ${
              currentPlan === plan.tier ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-2">{plan.tier}</h3>
              <p className="text-lg font-bold mb-4">${plan.price}/month</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle2 className="text-green-500 mr-2" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-6 py-2 rounded-lg font-medium transition ${
                currentPlan === plan.tier
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={currentPlan === plan.tier || loading}
              onClick={() => handleUpgrade(plan)}
            >
              {currentPlan === plan.tier ? "Current Plan" : "Upgrade"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
