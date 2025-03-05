import jwt from "jsonwebtoken";

export const generateAccessToken = async (userId) => {
  try {
    return await jwt.sign(
      {
        _id: userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    console.error(
      "Something went wrong while genearting access adn refresh token",
      error
    );
  }
};
