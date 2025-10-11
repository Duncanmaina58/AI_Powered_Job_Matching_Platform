import React from "react";

/**
 * JobCard Component
 * ------------------
 * Displays a single job posting in a professional card layout.
 * Props:
 *   - job: {
 *       title: string,
 *       company: string,
 *       location: string,
 *       description: string
 *     }
 */

function JobCard({ job }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        padding: "20px",
        marginBottom: "20px",
        transition: "transform 0.2s ease-in-out",
      }}
      className="job-card"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 style={{ color: "#333", marginBottom: "8px" }}>{job.title}</h3>
      <p style={{ color: "#555", fontWeight: "bold", marginBottom: "4px" }}>
        {job.company}
      </p>
      <p style={{ color: "#777", fontSize: "14px", marginBottom: "10px" }}>
        📍 {job.location}
      </p>
      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.5" }}>
        {job.description.length > 120
          ? job.description.substring(0, 120) + "..."
          : job.description}
      </p>
      <button
        style={{
          marginTop: "15px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => alert(`Applied for ${job.title} at ${job.company}`)}
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;
