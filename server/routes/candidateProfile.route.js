import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addEducation,
  addExperience,
  addSkills,
  createOrUpdateProfile,
  deleteEducation,
  deleteExperience,
  getCandidateProfile,
  removeSkill,
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
candidateProfileRoutes.delete(
  "/delete-education/:educationId",
  protect,
  deleteEducation
);
candidateProfileRoutes.post("/add-skills", protect, addSkills);
candidateProfileRoutes.delete(
  "/remove-skill/:candidateId",
  protect,
  removeSkill
);

export default candidateProfileRoutes;
