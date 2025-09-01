import { asyncHandler } from "../utils/asyncHandler.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { profileValidationSchema } from "../utils/validation.js";

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

// Add experience item to profile
export const addExperience = asyncHandler(async (req, res) => {
  // 1. Extract candidateId from req.user
  // 2. Validate experience data from req.body (company, role, dates, description)
  // 3. Find profile and push new experience item into experience array
  // 4. Save and return updated profile
});

// Update an experience entry by experienceId
export const updateExperience = asyncHandler(async (req, res) => {
  // 1. Extract candidateId from req.user and experienceId from req.params
  // 2. Validate updated experience data
  // 3. Find profile and update specific experience doc by id
  // 4. Save and return updated profile or error if experience not found
});

// Delete an experience entry by experienceId
export const deleteExperience = asyncHandler(async (req, res) => {
  // 1. Extract candidateId from req.user and experienceId from req.params
  // 2. Find profile and remove experience item by id
  // 3. Save and return updated profile
});

// Similarly for Education (add, update, delete)

// Add skills to profile (array update)
// Update skills in profile
// Remove skill from profile

// Upload or update resume file
export const uploadResume = asyncHandler(async (req, res) => {
  // 1. Candidate authentication ensures req.user._id is candidateId
  // 2. Receive file via middleware (multer/cloudinary etc.)
  // 3. Validate file type and size
  // 4. Upload file to cloud storage and get URL
  // 5. Update profile resumeUrl field
  // 6. Save and return updated profile with resume URL
});

// Delete resume file from profile
export const deleteResume = asyncHandler(async (req, res) => {
  // 1. Candidate authentication
  // 2. Remove resumeUrl field from profile
  // 3. Optionally delete file from cloud storage
  // 4. Save and return updated profile
});
