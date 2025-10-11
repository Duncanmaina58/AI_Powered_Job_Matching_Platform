import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>AI Job Matcher</h2>
      <div>
        <Link to="/jobs" style={styles.link}>Jobs</Link>
        <Link to="/ai" style={styles.link}>AI Match</Link>
        <Link to="/login" style={styles.link}>Logout</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#0a0a23",
    color: "#fff",
  },
  logo: { fontWeight: "bold", fontSize: "22px" },
  link: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "20px",
    fontSize: "16px",
  },
};

export default Navbar;
