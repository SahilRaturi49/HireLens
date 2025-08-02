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

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.patch("/change-password", protect, changeCurrentPassword);
router.post("/update", protect, updateAccountDetails);

export default router;