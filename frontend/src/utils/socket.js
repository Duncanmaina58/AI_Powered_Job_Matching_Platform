// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// initialize socket but do NOT auto connect in SSR environments
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // we'll connect after we have the user info/token
});

export default socket;
