// client/src/components/Notifications.jsx
import React from "react";

export default function Notifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 w-80 border text-center text-gray-500">
        No new notifications
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-80 border max-h-80 overflow-y-auto">
      <h3 className="text-gray-700 font-semibold mb-2">Notifications</h3>
      <ul className="space-y-2">
        {notifications.map((note, index) => (
          <li
            key={index}
            className="p-2 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition"
          >
            <p className="text-sm text-gray-700">{note.message || note.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
