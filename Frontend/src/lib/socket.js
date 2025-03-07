import { baseUrl } from "@/api/applyJob";
import { io } from "socket.io-client";

const socket = new io(`${baseUrl}`, {
  withCredentials: true,
});

export default socket;
