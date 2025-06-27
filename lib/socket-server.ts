import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function initSocket(server: HTTPServer) {
  if (!io) {
    io = new IOServer(server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }

  return io;
}