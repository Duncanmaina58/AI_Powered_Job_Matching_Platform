import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const createSubscription = async () => {
      const userId = searchParams.get("userId");
      const tier = searchParams.get("tier");

      if (!userId || !tier) return;

      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/subscription/create`,
          { userId, tier, paymentId: `STRIPE_${Date.now()}` },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(`🎉 Subscription upgraded to ${tier}!`);
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to upgrade subscription. Contact support.");
      }
    };

    createSubscription();
  }, []);

  return <div className="flex items-center justify-center h-screen text-2xl font-bold">Processing your subscription...</div>;
}
