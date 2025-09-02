import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addEducation,
  addExperience,
  createOrUpdateProfile,
  deleteExperience,
  getCandidateProfile,
  updateEducation,
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
candidateProfileRoutes.delete(
  "/delete-experience/:experienceId",
  protect,
  deleteExperience
);
candidateProfileRoutes.post("/add-education", protect, addEducation);
candidateProfileRoutes.put(
  "/update-education/:educationId",
  protect,
  updateEducation
);

export default candidateProfileRoutes;
