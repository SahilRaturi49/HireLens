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
import { checkJobOwnership } from "../middlewares/ownership.middleware.js";

const jobRoutes = express.Router();

jobRoutes.get("/", getJobs);
jobRoutes.get("/:slug", getjobBySLug);

jobRoutes.post("/", protect, authorize("recruiter"), createJob);
jobRoutes.patch(
  "/:jobId",
  protect,
  authorize("recruiter"),
  checkJobOwnership,
  updateJob
);
jobRoutes.delete("/:jobId", protect, authorize("admin"), deleteJob);
jobRoutes.patch(
  "/:jobId/activate",
  protect,
  authorize("recruiter"),
  checkJobOwnership,
  activateJob
);
jobRoutes.patch(
  "/:jobId/deactivate",
  protect,
  authorize("recruiter"),
  checkJobOwnership,
  softDeleteJob
);

export default jobRoutes;
