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

// Candidate views his/her own applications
export const getMyApplications = asyncHandler(async (req, res) => {
  // Steps:
  // 1. Extract userId from req.user
  // 2. Query applications collection filtering by userId
  // 3. Populate job details for display
  // 4. Paginate results if needed (page, limit from query)
  // 5. Return list of applications with relevant metadata

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

// Recruiter retrieves all applications for a given job
export const getApplicationsByJob = asyncHandler(async (req, res) => {
  // Steps:
  // 1. Extract jobId from req.params
  // 2. Validate jobId format
  // 3. Check if logged-in recruiter owns the job (authorization)
  // 4. Query applications collection filtering by jobId
  // 5. Populate user (candidate) details for better display
  // 6. Paginate results if needed
  // 7. Return list of applications
});

// Recruiter updates the status of a candidate’s application
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  // Steps:
  // 1. Extract applicationId from req.params
  // 2. Extract new status from req.body
  // 3. Validate status is one of allowed enum values
  // 4. Find application by applicationId
  // 5. Check if recruiter owns the related job (authorization)
  // 6. Update status and updatedAt timestamp
  // 7. Save and return updated application info
});

// Candidate withdraws an application
export const withdrawApplication = asyncHandler(async (req, res) => {
  // Steps:
  // 1. Extract applicationId from req.params
  // 2. Find application by id
  // 3. Check if user owns the application (authorization)
  // 4. Mark application as "withdrawn" or delete record as per business logic
  // 5. Save/update and return confirmation response
});
