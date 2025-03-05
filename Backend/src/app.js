import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";
import companyRouter from "./routes/company.route.js";
import applicationRouter from "./routes/jobApplication.route.js";
import messageRouter from "./routes/message.route.js";
import "./config.js";
import http from "http";
import { initSocket } from "./socket.js";
import "./utils/task1.js";
import "./utils/task2.js";

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

const apiRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN_NAME,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(apiRateLimit);
app.use(express.static("public"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", applicationRouter);
app.use("/api/v1/chat", messageRouter);

export { server, io, app };
