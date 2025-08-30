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

const jobRoutes = express.Router();

jobRoutes.post("/create-job", protect, createJob);
jobRoutes.get("/get-job", protect, getJobs);
jobRoutes.get("/:slug", protect, getjobBySLug);
jobRoutes.patch("/update-job/:jobId", protect, updateJob);
jobRoutes.delete("/delete-job/:jobId", protect, deleteJob);
jobRoutes.put("/activate-job/:jobId", protect, activateJob);
jobRoutes.put("/deactivate-job/:jobId", protect, softDeleteJob);

export default jobRoutes;
