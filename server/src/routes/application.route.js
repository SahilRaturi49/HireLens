import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import {
  applyToJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/application.controller.js";

const applicationRoutes = express.Router();

applicationRoutes.post("/apply", protect, applyToJob);
applicationRoutes.get("/my-applications", protect, getMyApplications);
applicationRoutes.get(
  "/applications-by-job/:jobId",
  protect,
  authorize("recruiter"),
  getApplicationsByJob
);
applicationRoutes.put(
  "/update-status/:applicationId",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);
applicationRoutes.put(
  "/withdraw-application/:applicationId",
  protect,
  withdrawApplication
);

export default applicationRoutes;
