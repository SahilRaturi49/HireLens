import { asyncHandler } from "../utils/asyncHandler.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {
  profileValidationSchema,
  experienceSchema,
} from "../utils/validation.js";

export const getCandidateProfile = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }

  const profile = await CandidateProfile.findOne({ candidateId });

  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profile },
        "Candidate profile fetched successfully"
      )
    );
});

export const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }

  const { error, value } = profileValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }

  if (req.file && req.file.path) {
    value.resumeUrl = req.file.path;
  }

  let profile = await CandidateProfile.findOne({ candidateId });

  if (profile) {
    Object.assign(profile, value);
  } else {
    profile = new CandidateProfile({ candidateId, ...value });
  }

  await profile.save();
  return res
    .status(profile.isNew ? 201 : 200)
    .json(
      new ApiResponse(
        profile.isNew ? 201 : 200,
        { profile },
        profile.isNew
          ? "Candidate profile created successfully"
          : "Candidate profile updated successfully"
      )
    );
});

export const addExperience = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }

  const { error, value } = experienceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }
  let profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    profile = new CandidateProfile({ candidateId, experience: [value] });
  } else {
    profile.experience.push(value);
  }
  await profile.save();

  return res
    .status(profile.isNew ? 201 : 200)
    .json(
      new ApiResponse(
        profile.isNew ? 201 : 200,
        { profile },
        profile.isNew
          ? "Profile created successfully"
          : "Profile updated successfully"
      )
    );
});

const experienceUpdateSchema = experienceSchema
  .fork(Object.keys(experienceSchema.describe().keys), (schema) =>
    schema.optional()
  )
  .min(1);

export const updateExperience = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { experienceId } = req.params;

  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }
  console.log("CandidateID: ", candidateId);
  if (!experienceId || !mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid or missing experience ID");
  }

  const { error, value } = experienceUpdateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }

  const profile = await CandidateProfile.findOne({
    candidateId: candidateId.toString(),
  });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const experienceItem = profile.experience.id(experienceId);
  if (!experienceItem) {
    throw new ApiError(404, "Experienceentry not found");
  }

  Object.assign(experienceItem, value);

  await profile.save();

  res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Experience updated successfully"));
});
