import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addExperience,
  createOrUpdateProfile,
  getCandidateProfile,
} from "../controllers/candidateProfile.controller.js";

const candidateProfileRoutes = express.Router();

candidateProfileRoutes.get("/get-profile", protect, getCandidateProfile);
candidateProfileRoutes.post("/create-profile", protect, createOrUpdateProfile);
candidateProfileRoutes.post("/add-experience", protect, addExperience);

export default candidateProfileRoutes;
