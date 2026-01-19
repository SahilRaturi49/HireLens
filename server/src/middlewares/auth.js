import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    // console.log("AUTH HEADER:", req.headers.authorization);
    // console.log("COOKIE TOKEN:", req.cookies?.accessToken);

    const authHeader = req.headers.authorization;

    // const token =
    //   req.cookies?.accessToken ||
    //   (authHeader && authHeader.startsWith("Bearer ")
    //     ? authHeader.split(" ")[1]
    //     : null);
    const token =
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null) || req.cookies?.accessToken;

    // console.log("FINAL TOKEN USED:", token);

    if (!token) {
      return next(new ApiError(401, "Not authorized, token missing"));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }

    return next(new ApiError(401, "Invalid access token"));
  }
};
