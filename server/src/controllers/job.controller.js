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
  } = req.body;

  if (!title || !companyName || !description || !location) {
    throw new ApiError(
      400,
      "Title, Company Name, Description, and Location are required"
    );
  }

  if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) {
    throw new ApiError(
      400,
      "salaryMax must be greater than or equal to salaryMin"
    );
  }
  const job = await Job.create({
    title,
    companyName,
    description,
    location,
    requirements,
    responsibilities,
    jobType,
    salaryMin,
    salaryMax,
    createdBy: req.user._id,
  });

  const jobUrl = `/jobs/${job.slug}`;

  return res
    .status(201)
    .json(new ApiResponse(201, { job, jobUrl }, "Job created successfully"));
});

export const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, title, location, jobType } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  const query = {
    isActive: true,
  };

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  const [jobs, total] = await Promise.all([
    Job.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  console.log("QUERY:", query);
  const allJobs = await Job.find({}).select("title isActive");
  console.log("ALL JOB TITLES:", allJobs);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        jobs,
      },
      jobs.length ? "Jobs fetched successfully" : "No jobs found"
    )
  );
});

export const getJobBySLug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(400, "Job slug is required");
  }

  const job = await Job.findOne({
    slug,
    isActive: true,
  }).populate("createdBy", "name email");

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

  if (job.createdBy.toString() !== req.user._id.toString()) {
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

  if (job.createdBy.toString() !== req.user._id.toString()) {
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

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to deactivate this job");
  }

  job.isActive = false;
  await job.save();

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

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to activate this job");
  }

  job.isActive = true;
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job activated successfully"));
});
