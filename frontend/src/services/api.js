import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-powered-job-matching-platform.onrender.com"
});

export default API;
