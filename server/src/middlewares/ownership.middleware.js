import { ApiError } from "../utils/ApiError.js";
import { Job } from "../models/job.model.js";

export const checkJobOwnership = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return next(new ApiError(404, "Job not found"));
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You do not own this job"));
    }

    req.job = job;
    next();
  } catch (error) {
    return next(new ApiError(400, "Invalid job id"));
  }
};
