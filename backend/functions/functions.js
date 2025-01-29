import jwt from "jsonwebtoken";
export const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.Id, email: user.Email },
    process.env.JWT_SECRET_KEY || "access_token_secret",
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
  return accessToken;
};
export const generateRefreshAccessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.Id, email: user.Email },
    process.env.JWT_REFRESH_SECRET_KEY || "refresh_token_secret",
    { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
  );
  return accessToken;
};
