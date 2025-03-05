import { Server } from "socket.io";

const users = new Map();

export const getReceiverSocketId = (userId) => {
  return users.get(userId);
};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      users.set(userId, socket.id);
      console.log("User joined:", userId, "Socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      users.forEach((value, key) => {
        if (value === socket.id) {
          users.delete(key);
        }
      });
    });
  });

  return io;
};
