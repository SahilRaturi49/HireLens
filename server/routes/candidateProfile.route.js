import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addExperience,
  createOrUpdateProfile,
  getCandidateProfile,
  updateExperience,
} from "../controllers/candidateProfile.controller.js";

const candidateProfileRoutes = express.Router();

candidateProfileRoutes.get("/get-profile", protect, getCandidateProfile);
candidateProfileRoutes.post("/create-profile", protect, createOrUpdateProfile);
candidateProfileRoutes.post("/add-experience", protect, addExperience);
candidateProfileRoutes.put(
  "/update-experience/:experienceId",
  protect,
  updateExperience
);

export default candidateProfileRoutes;
