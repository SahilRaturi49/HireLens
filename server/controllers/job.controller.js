import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    description,
    location,
    requirements,
    responsibilities,
    jobType,
    salaryMin,
    salaryMax,
    isActive,
  } = req.body;

  if (!title || !companyName || !description) {
    throw new ApiError(400, "Title, Company Name, Description are required");
  }

  const job = await Job.create({
    recruiterId: req.user._id,
    title,
    companyName,
    description,
    location,
    requirements,
    responsibilities,
    jobType,
    salaryMin,
    salaryMax,
    isActive,
  });

  const jobUrl = `/jobs/${job.slug}`;

  return res
    .status(201)
    .json(new ApiResponse(201, { job, jobUrl }, "Job created successfully"));
});

export const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    title,
    location,
    jobType,
    isActive,
  } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = { $regex: jobType, $options: "i" };
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }
  console.log("Built Query:", query);

  const jobs = await Job.find(query)
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(query);

  if (jobs.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No jobs found for the given filters"));
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        jobs,
      },
      "Jobs fetched successfully"
    )
  );
});

export const getjobBySLug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(400, "Job slug is required");
  }

  const job = await Job.findOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  }).populate("recruiterId", "name email");

  if (!job) {
    throw new ApiError(404, "job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "invalid or missing job ID");
  }
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const allowedUpdates = [
    "title",
    "description",
    "location",
    "jobType",
    "salaryMin",
    "salaryMax",
    "isActive",
    "requirements",
    "responsibilities",
  ];

  Object.keys(updates).forEach((field) => {
    if (!allowedUpdates.includes(field)) {
      throw new ApiError(400, `Invalid field in update: ${field}`);
    }
  });

  Object.assign(job, updates);

  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job updated successfully"));
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid or missing job ID");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this job");
  }

  await Job.findByIdAndDelete(jobId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted permanently"));
});

export const softDeleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid or missing job ID");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to deactivate this job");
  }

  job.isActive = false;
  await job.save();
  console.log("Before save:", job.isActive);
  await job.save();
  console.log("After save:", job.isActive);
  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job deactivated successfully"));
});

export const activateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid or missing job ID");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to activate this job");
  }

  job.isActive = true;
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job activated successfully"));
});
