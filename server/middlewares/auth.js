import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"

export const protect = async (req, res, next) => {
    console.log("Access Token from Cookie:", req.cookies.accessToken);
    console.log("All cookies:", req.cookies);
    try {
        let token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new ApiError(401, "Not authorized, No token");
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!req.user) {
            throw new ApiError(401, "User not found");
        }

        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
}
