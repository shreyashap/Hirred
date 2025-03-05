import bcrypt from "bcrypt";

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  if (!plainPassword) return;

  const hashedPassowrd = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassowrd;
};

const isPasswordCorrect = async (plainPassword, hashedPassword) => {
  const isPassCorrect = await bcrypt.compare(plainPassword, hashedPassword);
  return isPassCorrect;
};

export { hashPassword, isPasswordCorrect };
