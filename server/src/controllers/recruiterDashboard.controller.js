import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

export const getRecruiterDashboardStats = asyncHandler(async (req, res) => {
  const recruiterObjectId = req.user._id;

  const totalJobs = await Job.countDocuments({
    createdBy: recruiterObjectId,
  });

  console.log("DASHBOARD recruiterObjectId:", recruiterObjectId.toString());

  const stats = await Application.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $match: {
        "job.createdBy": recruiterObjectId,
      },
    },
    {
      $facet: {
        totalApplications: [{ $count: "count" }],
        statusBreakdown: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        applicationsPerJob: [{ $group: { _id: "$jobId", count: { $sum: 1 } } }],
      },
    },
  ]);

  console.log("DASHBOARD raw stats:", JSON.stringify(stats, null, 2));

  const result = stats[0] || {};

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs,
        totalApplications: result.totalApplications?.[0]?.count || 0,
        statusBreakdown: result.statusBreakdown || [],
        applicationsPerJob: result.applicationsPerJob || [],
      },
      "Recruiter dashboard stats fetched successfully"
    )
  );
});
