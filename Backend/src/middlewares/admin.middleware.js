import { User } from "../models/user.model.js";

export const verifyRecruiter = async (req, res, next) => {
  try {
    const userId = req?.user._id;
    if (!userId) {
      return res.status(404).json({
        error: "Not a recruiter ",
      });
    }
    const user = await User.findById(userId);

    if (!user || user.accountType !== "recruiter") {
      return res.status(401).json({
        error: "Only recruiters can post jobs",
      });
    }

    next();
  } catch (error) {
    console.error(error);
  }
};
