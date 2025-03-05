import { io } from "socket.io-client";

const socket = new io("http://localhost:3000", {
  withCredentials: true,
});

export default socket;
