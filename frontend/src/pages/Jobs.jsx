import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

/**
 * Jobs Page
 * ----------
 * Fetches all jobs from the backend API and displays them using JobCard components.
 * Endpoint: GET /api/jobs
 */

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch jobs from backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        setJobs(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Loading state
  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading jobs...</h2>;
  }

  // ✅ Error state
  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  // ✅ No jobs found
  if (jobs.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>No jobs available at the moment.</p>;
  }

  // ✅ Display job cards
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Available Jobs</h1>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
