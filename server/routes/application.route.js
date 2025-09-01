import express from "express";
import upload from "../middlewares/upload.js";
import { protect } from "../middlewares/auth.js";

import {
  applyToJob,
  getMyApplications,
} from "../controllers/application.controller.js";

const applicationRoutes = express.Router();

applicationRoutes.post("/apply", protect, upload.single("resume"), applyToJob);
applicationRoutes.get("/my-applications", protect, getMyApplications);

export default applicationRoutes;
