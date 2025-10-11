import { useState } from "react";
import API from "../services/api";

function AIMatch() {
  const [skills, setSkills] = useState("");
  const [matches, setMatches] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/jobs/ai-match", { skills });
    setMatches(data);
  };

  return (
    <div style={styles.container}>
      <h2>AI Job Matcher</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="Enter your skills (e.g., React, Node.js, MongoDB)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <button type="submit">Find Matches</button>
      </form>

      <div style={styles.results}>
        {matches.map((job, i) => (
          <div key={i} style={styles.jobCard}>
            <h4>{job.title}</h4>
            <p>{job.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
  form: { display: "flex", flexDirection: "column", width: "400px", gap: "10px" },
  results: { marginTop: "30px" },
  jobCard: { border: "1px solid #ddd", padding: "15px", borderRadius: "10px" },
};

export default AIMatch;
