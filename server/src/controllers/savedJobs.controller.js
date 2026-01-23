import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

export const saveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Valid Job ID is required");
  }

  const jobExists = await Job.findById(jobId);
  if (!jobExists || !jobExists.isActive) {
    throw new ApiError(404, "Job not found or inacvtive");
  }

  const user = await User.findById(req.user._id);

  if (user.savedJobs.includes(jobId)) {
    throw new ApiError(409, "Job is already saved");
  }

  user.savedJobs.push(jobId);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.savedJobs, "Job saved successfully"));
});

export const removeJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Valid Job ID is required");
  }

  const user = await User.findById(req.user._id);

  user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user.savedJobs, "Job removed from save list"));
});

export const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "savedJobs",
    "title companyName location jobType salaryMin salaryMax slug"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user.savedJobs, "Saved jobs fetched"));
});
