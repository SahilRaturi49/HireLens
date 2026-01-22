import express from "express";
import {
  createRecruiterRequest,
  getMyRecruiterRequest,
  getPendingRecruiterRequests,
  approveRecruiterRequest,
  rejectRecruiterRequest,
} from "../controllers/recruiterRequest.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("candidate"), createRecruiterRequest);
router.get("/me", protect, getMyRecruiterRequest);
router.get("/admin", protect, authorize("admin"), getPendingRecruiterRequests);
router.patch(
  "/admin/:id/approve",
  protect,
  authorize("admin"),
  approveRecruiterRequest
);
router.patch(
  "/admin/:id/reject",
  protect,
  authorize("admin"),
  rejectRecruiterRequest
);

export default router;
