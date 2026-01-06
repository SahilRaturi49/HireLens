import express from "express";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

import {
  addEducation,
  addExperience,
  addSkills,
  createOrUpdateProfile,
  deleteEducation,
  deleteExperience,
  deleteResume,
  getCandidateProfile,
  removeSkill,
  updateEducation,
  updateExperience,
  uploadResume,
} from "../controllers/candidateProfile.controller.js";

const router = express.Router();

router.get("/", protect, getCandidateProfile);
router.post("/", protect, createOrUpdateProfile);

router.post("/experience", protect, addExperience);
router.put("/experience/:experienceId", protect, updateExperience);
router.delete("/experience/:experienceId", protect, deleteExperience);

router.post("/education", protect, addEducation);
router.put("/education/:educationId", protect, updateEducation);
router.delete("/education/:educationId", protect, deleteEducation);

router.post("/skills", protect, addSkills);
router.delete("/skills", protect, removeSkill);

router.post("/resume", protect, upload.single("resume"), uploadResume);
router.delete("/resume", protect, deleteResume);

export default router;
