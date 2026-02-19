import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";

const userRoutes = express.Router();
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/refresh-token", refreshAccessToken);

userRoutes.post("/logout", protect, logoutUser);
userRoutes.get("/me", protect, getCurrentUser);
userRoutes.patch("/change-password", protect, changeCurrentPassword);
userRoutes.patch("/update", protect, updateAccountDetails);

export default userRoutes;
