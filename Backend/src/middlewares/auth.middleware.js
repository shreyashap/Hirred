import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        error: "Invalid access token format",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({
        error: "Invalid access token :",
      });
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -profileImg"
    );
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized request",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Invalid token", error);
  }
};
