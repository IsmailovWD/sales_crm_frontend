import { io, Socket } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
const transports = ["websocket", "polling"];
const testSocket: Socket = io(`${baseUrl}/chat`, {
  withCredentials: true,
  autoConnect: false,
  auth: { token: token || undefined, "x-tenant-id": window.location.hostname },
  transports,
});

const crmSocket: Socket = io(`${baseUrl}/crm`, {
  withCredentials: true,
  autoConnect: false,
  auth: { token: token || undefined, "x-tenant-id": window.location.hostname },
  transports,
});

export { testSocket, crmSocket };
