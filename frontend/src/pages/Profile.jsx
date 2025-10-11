import React from "react";

export default function Profile() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Profile Settings</h3>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          defaultValue="Duncan Nyaga"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue="dun.can.duntez@gmail.com"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
