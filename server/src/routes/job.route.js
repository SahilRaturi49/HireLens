import express from "express";
import {
  activateJob,
  createJob,
  deleteJob,
  getjobBySLug,
  getJobs,
  softDeleteJob,
  updateJob,
} from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const jobRoutes = express.Router();

jobRoutes.get("/", getJobs);
jobRoutes.get("/:slug", getjobBySLug);

jobRoutes.post("/", protect, authorize("recruiter"), createJob);
jobRoutes.patch("/:jobId", protect, authorize("recruiter"), updateJob);
jobRoutes.delete("/:jobId", protect, authorize("admin"), deleteJob);
jobRoutes.patch(
  "/:jobId/activate",
  protect,
  authorize("recruiter"),
  activateJob
);
jobRoutes.patch(
  "/:jobId/deactivate",
  protect,
  authorize("recruiter"),
  softDeleteJob
);

export default jobRoutes;
