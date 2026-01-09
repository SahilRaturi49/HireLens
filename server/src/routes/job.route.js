import express from "express";
import {
  activateJob,
  createJob,
  deleteJob,
  getJobBySLug,
  getJobs,
  softDeleteJob,
  updateJob,
} from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { checkJobOwnership } from "../middlewares/ownership.middleware.js";

const jobRoutes = express.Router();

jobRoutes.get("/", getJobs);
jobRoutes.get("/:slug", getJobBySLug);

jobRoutes.post("/", protect, authorize("recruiter"), createJob);
jobRoutes.patch(
  "/:jobId",
  protect,
  authorize("recruiter"),
  checkJobOwnership,
  updateJob
);
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

jobRoutes.delete("/:jobId", protect, authorize("admin"), deleteJob);

export default jobRoutes;
