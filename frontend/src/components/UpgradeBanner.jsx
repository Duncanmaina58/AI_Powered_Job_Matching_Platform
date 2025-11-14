import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpgradeBanner({ user, darkMode }) {
  const navigate = useNavigate();

  // If user has a premium plan, show a small thank-you message instead
  if (user?.subscriptionTier !== "Free") {
    return (
      <div
        className={`mb-6 rounded-xl p-4 flex items-center justify-between ${
          darkMode
            ? "bg-green-800 text-green-100 border border-green-600"
            : "bg-green-100 text-green-800 border border-green-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-400" />
          <div>
            <h3 className="font-semibold text-lg">
              You’re enjoying {user?.subscriptionTier} 🎉
            </h3>
            <p className="text-sm opacity-80">
              Thanks for being a valued premium member.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show upgrade prompt if on Free plan
  return (
    <div
      className={`mb-6 rounded-xl p-4 flex items-center justify-between ${
        darkMode
          ? "bg-yellow-900 text-yellow-100 border border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <Crown className="text-yellow-500" />
        <div>
          <h3 className="font-semibold text-lg">You’re on the Free Plan</h3>
          <p className="text-sm opacity-80">
            Upgrade to unlock premium job recommendations, AI matching, and more!
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard?tab=subscription")}
        className="bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
      >
        Upgrade Now
      </button>
    </div>
  );
}
