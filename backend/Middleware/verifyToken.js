import jwt from "jsonwebtoken";
import { HTTP } from "../Constants/constant.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Asumimos que el token viene en el encabezado Authorization: Bearer <token>

  if (!token) {
    return res
      .status(HTTP.FORBIDDEN)
      .send({ type: HTTP.FORBIDDEN, error: "No se proporcionó un token." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(HTTP.FORBIDDEN)
        .send({ type: HTTP.FORBIDDEN, error: "Token inválido." });
    }
    req.user = user;
    next();
  });
};
