import { asyncHandler } from "../utils/asyncHandler.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {
  profileValidationSchema,
  experienceSchema,
  educationSchema,
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

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Experience updated successfully"));
});

export const deleteExperience = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { experienceId } = req.params;

  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }

  if (!experienceId || !mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid or missing experience ID");
  }

  const profile = await CandidateProfile.findOne({
    candidateId: candidateId.toString(),
  });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const experienceItem = profile.experience.id(experienceId);
  if (!experienceItem) {
    throw new ApiError(404, "Experience entry not found");
  }

  profile.experience = profile.experience.filter(
    (exp) => exp._id.toString() !== experienceId
  );
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Experience deleted successfully"));
});

export const educationUpdateSchema = educationSchema
  .fork(Object.keys(educationSchema.describe().keys), (schema) =>
    schema.optional()
  )
  .min(1);

export const addEducation = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }

  const { error, value } = educationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }

  let profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    profile = new CandidateProfile({ candidateId, education: [value] });
  } else {
    profile.education.push(value);
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
          : "Education added successfully"
      )
    );
});

export const updateEducation = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { educationId } = req.params;

  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new ApiError(400, "Invalid or missing candidate ID");
  }
  if (!educationId || !mongoose.Types.ObjectId.isValid(educationId)) {
    throw new ApiError(400, "Invalid or missing education ID");
  }

  const { error, value } = educationUpdateSchema.validate(req.body, {
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

  const educationItem = profile.education.id(educationId);
  if (!educationItem) {
    throw new ApiError(404, "Education entry not found");
  }

  Object.assign(educationItem, value);

  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Education updated successfully"));
});
