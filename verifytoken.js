import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies["user-token"];

  if (!token) return next(createError(401, "you are not authenticated"));
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return next(createError(401, "token is not valid"));
    req.user = user;
  });
  next();
};
