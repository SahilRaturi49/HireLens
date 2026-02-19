import { Application } from "../models/application.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/applicationStatus.js";
import { Job } from "../models/job.model.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { jobId } = req.body;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  const jobExists = await Job.findOne({
    _id: jobId,
    isActive: true,
  });
  if (!jobExists) {
    throw new ApiError(404, "Job not found or inactive");
  }

  if (jobExists.createdBy.toString() === candidateId.toString()) {
    throw new ApiError(400, "Cannot apply to your own job");
  }

  if (!req.user.resumeUrl) {
    throw new ApiError(400, "Please upload your resume in profile first");
  }

  const application = await Application.create({
    candidateId,
    jobId,
    recruiterId: jobExists.createdBy,
    status: APPLICATION_STATUS.APPLIED,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully")
    );
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;

  let page = Math.max(parseInt(req.query.page) || 1, 1);
  let limit = Math.min(parseInt(req.query.limit) || 10, 20);
  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
    Application.find({ candidateId })
      .populate({
        path: "jobId",
        match: { isActive: true },
        select: "title companyName location jobType isActive slug",
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit),

    Application.countDocuments({ candidateId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results: applications,
        total: totalApplications,
        page,
        limit,
        totalPages: Math.ceil(totalApplications / limit),
      },
      applications.length
        ? "Applications fetched successfully"
        : "No applications found"
    )
  );
});

export const getApplicationsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const recruiterId = req.user._id;
  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid or missing job ID");
  }

  const job = await Job.findById(jobId).select("createdBy");
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Unauthorized to access applications of this job");
  }

  let page = Math.max(parseInt(req.query.page) || 1, 1);
  let limit = Math.min(parseInt(req.query.limit) || 10, 20);
  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
    Application.find({ jobId })
      .populate({
        path: "candidateId",
        select: "name email phone resumeUrl",
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments({ jobId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results: applications,
        total: totalApplications,
        page,
        limit,
        totalPages: Math.ceil(totalApplications / limit),
        hasNextPage: page * limit < totalApplications,
        hasPreviousPage: page > 1,
      },
      applications.length
        ? "Applications fetched successfully"
        : "No applications found"
    )
  );
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const recruiterId = req.user._id;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid Application ID format");
  }

  if (!status || !Object.values(APPLICATION_STATUS).includes(status)) {
    throw new ApiError(
      400,
      `Invalid status value. Allowed values: ${Object.values(
        APPLICATION_STATUS
      ).join(", ")}`
    );
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const job = await Job.findById(application.jobId).select("createdBy");
  if (!job) {
    throw new ApiError(404, "Job related to application not found");
  }
  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Unauthorized to update this application");
  }

  application.status = status;
  await application.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { application },
        "Application status updated successfully"
      )
    );
});
