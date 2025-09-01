import express from "express";
import { protect } from "../middlewares/auth.js";
import { createOrUpdateProfile } from "../controllers/candidateProfile.controller.js";

const candidateProfileRoutes = express.Router();

candidateProfileRoutes.post("/create-profile", protect, createOrUpdateProfile);

export default candidateProfileRoutes;
