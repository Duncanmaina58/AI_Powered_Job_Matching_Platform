import { useEffect, useState } from "react";
import { socket, connectSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }

    socket.on("newNotification", (notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          {notifications.map((n, i) => (
            <div key={i} className="p-2 border-b text-sm">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
