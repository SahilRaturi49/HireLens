import express from "express";
import { getRecruiterDashboardStats } from "../controllers/recruiterDashboard.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("recruiter"), getRecruiterDashboardStats);

export default router;
