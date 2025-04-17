import { io } from "socket.io-client";

// Same backend WebSocket URL
const SOCKET_URL = "http://localhost:4000";

export const socket = io(SOCKET_URL, { autoConnect: false });
