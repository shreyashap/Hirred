import { User } from "../models/user.model.js";

export const verifyIsApplicant = async (req, res, next) => {
  try {
    const userId = req?.user._id;

    const user = await User.findById(userId);

    if (!user || user.accountType !== "applicant") {
      return res.status(401).json({
        error: "Only applicant can access",
      });
    }

    next();
  } catch (error) {
    console.error(error);
  }
};
