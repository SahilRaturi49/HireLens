import { User } from '../models/user.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from '../utils/validation.js';
import { isProd } from '../config/env.js'


const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId).select("+refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found while generating tokens");
    };

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}

export const registerUser = asyncHandler(async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
        throw new ApiError(400, error.details[0].message);
    };

    const { name, email, username, password, role } = value;
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    };

    const user = await User.create({
        name,
        email,
        username,
        password,
        role,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Error occured while registering user");
    };

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registerd successfully"))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        throw new ApiError(400, error.details[0].message);
    };

    const { username, email, password } = value;

    const user = await User.findOne({
        $or: [
            email ? { email } : null,
            username ? { username: username.toLowerCase() } : null
        ].filter(Boolean)
    }).select("+password +refreshToken");

    if (!user) {
        throw new ApiError(404, "User does not exist");
    };

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"))


})

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 }
    });

    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax"
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));

});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    };
    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token")
    };

    const user = await User.findById(decodedToken._id).select("+refreshToken");
    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is expired or not valid");
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token is refreshed successfully"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(404, "Old and new password are required");
    };

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found")
    };
    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    };
    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "Name or email are required");
    };

    const updateData = {};
    if (name) {
        updateData.name = name
    }
    if (email) {
        updateData.email = email
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    );

    return res.status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

