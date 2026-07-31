import { io, Socket } from "socket.io-client";

// ======================================
// Configuration
// ======================================

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5003";

// ======================================
// Socket Instance
// ======================================

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,

  transports: ["websocket"],

  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,

  withCredentials: true,
});

// ======================================
// Connect
// ======================================

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// ======================================
// Disconnect
// ======================================

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ======================================
// Events
// ======================================

socket.on("connect", () => {
  console.log("✅ Socket Connected");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket Disconnected");
  console.log("Reason:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket Error");
  console.error(error.message);
});

socket.on("reconnect", (attempt) => {
  console.log(`✅ Reconnected after ${attempt} attempt(s)`);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Reconnect Attempt ${attempt}`);
});

socket.on("reconnect_failed", () => {
  console.log("❌ Reconnection Failed");
});