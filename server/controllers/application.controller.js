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

  const jobExists = await Job.findById(jobId);
  if (!jobExists) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({
    candidateId,
    jobId,
  });

  if (!req.file || !req.file.path) {
    throw new ApiError(400, "Resume file is required");
  }

  const resumeUrl = req.file.path;

  if (existingApplication) {
    throw new ApiError(409, "You have already applied to this job");
  }

  const application = await Application.create({
    candidateId,
    jobId,
    resumeUrl,
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
  if (!candidateId) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const applications = await Application.find({ candidateId })
    .populate("jobId")
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalApplications = await Application.countDocuments({ candidateId });

  if (!applications.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          results: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
        "No applications found"
      )
    );
  }

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
      "All applications fetched"
    )
  );
});

export const getApplicationsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  console.log("JobId param:", req.params);

  const recruiterId = req.user._id;
  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid or missing job ID");
  }

  const job = await Job.findById(jobId).select("recruiterId");
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiterId.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Unauthorized to access applications of this job");
  }

  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const applications = await Application.find({ jobId })
    .populate({
      path: "candidateId",
      select: "name email phone",
    })
    .sort({ appliedAt: 1 })
    .skip(skip)
    .limit(limit);

  const totalApplications = await Application.countDocuments({ jobId });

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
      "Applications fetched successfully"
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

  const job = await Job.findById(application.jobId).select("recruiterId");
  if (!job) {
    throw new ApiError(404, "Job related to application not found");
  }
  if (job.recruiterId.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Unauthorized to update this application");
  }

  application.status = status;
  application.updatedAt = new Date();

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

export const withdrawApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const candidateId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid Application ID format");
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.candidateId.toString() !== candidateId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to withdraw this application"
    );
  }

  application.status = "withdrawn";
  application.updatedAt = new Date();

  await application.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { application },
        "Application withdrawn successfully"
      )
    );
});
