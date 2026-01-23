import express from "express";
import {
  saveJob,
  removeJob,
  getSavedJobs,
} from "../controllers/savedJobs.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("candidate"), saveJob);
router.get("/", protect, authorize("candidate"), getSavedJobs);
router.delete("/:jobId", protect, authorize("candidate"), saveJob);

export default router;
