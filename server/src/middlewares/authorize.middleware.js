import { ApiError } from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Not Authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Role "${req.user.role}" not allowed`)
      );
    }

    next();
  };
};
