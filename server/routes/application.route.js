import express from "express";
import upload from "../middlewares/upload.js";
import { protect } from "../middlewares/auth.js";

import {
  applyToJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const applicationRoutes = express.Router();

applicationRoutes.post("/apply", protect, upload.single("resume"), applyToJob);
applicationRoutes.get("/my-applications", protect, getMyApplications);
applicationRoutes.get(
  "/applications-by-job/:jobId",
  protect,
  getApplicationsByJob
);
applicationRoutes.put(
  "/update-status/:applicationId",
  protect,
  updateApplicationStatus
);

export default applicationRoutes;
