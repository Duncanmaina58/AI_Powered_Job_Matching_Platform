import React from "react";

const JobCard = ({ job }) => (
  <div className="p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
    <h4 className="font-semibold text-gray-900">{job.title}</h4>
    <p className="text-sm text-gray-600">{job.company}</p>
    <p className="text-sm text-gray-500 mt-2">{job.location || "Remote"}</p>
    <p className="text-xs mt-2 text-gray-400">{job.required_skills?.slice(0,3).join(", ")}</p>

    <div className="mt-4 flex gap-2">
      <a href={`/jobs/${job._id}`} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Apply</a>
      <a href={`/jobs/${job._id}`} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">Details</a>
    </div>
  </div>
);

export default JobCard;
