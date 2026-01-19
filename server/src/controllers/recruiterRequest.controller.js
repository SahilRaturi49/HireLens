import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { RecruiterRequest } from "../models/recruiterRequest.model.js";
import { User } from "../models/user.model.js";
import { response } from "express";

export const createRecruiterRequest = asyncHandler(async (req, res) => {
  const { companyName, officialEmail, website, linkedIn, designation } =
    req.body;

  if (!companyName || !officialEmail || designation) {
    throw new ApiError(
      400,
      "Company Name, Official Email and Designation are required"
    );
  }

  if (req.user.role === "recruiter" || req.user.role === "admin") {
    throw new ApiError(
      403,
      "You are already authorized and cannot request recruiter role"
    );
  }

  const request = await RecruiterRequest.create({
    userId: req.user._id,
    companyName,
    officialEmail,
    website,
    linkedIn,
    designation,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, request, "Recruiter Request submitted successfully")
    );
});

export const getMyRecruiterRequest = asyncHandler(async (req, res) => {
  const request = await RecruiterRequest.findOne({ userId: req.user._id }).sort(
    { createdAt: -1 }
  );

  if (!request) {
    throw new ApiError(404, "No recruiter request found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, request, "Recruiter request fetched"));
});

export const getPendingRecruiterRequests = asyncHandler(async (req, res) => {
  const requests = await RecruiterRequest.find({ status: "pending" })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Pending recruiter requests fetched"));
});

export const approveRecruiterRequest = asyncHandler(async (req, res) => {
  const request = await RecruiterRequest.findById(req.param.id);

  if (!request) {
    throw new ApiError(404, "Recruiter request not found");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, "Request already processed");
  }

  request.status = "approved";
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  await request.save();

  await User.findByIdAndUpdate(request.userId, {
    role: "recruiter",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Recruiter request approved"));
});

export const rejectRecruiterRequest = asyncHandler(async (req, res) => {
  const request = await RecruiterRequest.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Recruiter request not found");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, "Request already processed");
  }

  request.status = "rejected";
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Recruiter request rejected"));
});
