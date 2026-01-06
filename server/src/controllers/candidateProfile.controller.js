import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
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
  const isNewProfile = !profile;

  if (profile) {
    Object.assign(profile, value);
  } else {
    profile = new CandidateProfile({ candidateId, ...value });
  }

  await profile.save();
  return res
    .status(isNewProfile ? 201 : 200)
    .json(
      new ApiResponse(
        isNewProfile ? 201 : 200,
        { profile },
        isNewProfile
          ? "Candidate profile created successfully"
          : "Candidate profile updated successfully"
      )
    );
});

export const addExperience = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { error, value } = experienceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }
  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Create profile first");
  }
  profile.experience.push(value);

  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Experience added successfully"));
});

const experienceUpdateSchema = experienceSchema
  .fork(Object.keys(experienceSchema.describe().keys), (schema) =>
    schema.optional()
  )
  .min(1);

export const updateExperience = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { experienceId } = req.params;

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

  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const experienceItem = profile.experience.id(experienceId);
  if (!experienceItem) {
    throw new ApiError(404, "Experience entry not found");
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

  if (!experienceId || !mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid or missing experience ID");
  }

  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const experienceItem = profile.experience.id(experienceId);
  if (!experienceItem) {
    throw new ApiError(404, "Experience entry not found");
  }

  experienceItem.deleteOne();
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
  const { error, value } = educationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, `Validation error: ${errorMessages.join("; ")}`);
  }

  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Create profile first");
  }

  profile.education.push(value);
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Education added successfully"));
});

export const updateEducation = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { educationId } = req.params;

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

  const profile = await CandidateProfile.findOne({ candidateId });
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
    .json(
      new ApiResponse(
        200,
        { education: educationItem },
        "Education updated successfully"
      )
    );
});

export const deleteEducation = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { educationId } = req.params;

  if (!educationId || !mongoose.Types.ObjectId.isValid(educationId)) {
    throw new ApiError(400, "Invalid or missing education ID");
  }

  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const educationItem = profile.education.id(educationId);
  if (!educationItem) {
    throw new ApiError(404, "Education entry not found");
  }

  educationItem.deleteOne();
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Education deleted successfully"));
});

export const addSkills = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { skills } = req.body;

  if (!Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "Skills must be a non-empty array");
  }

  if (!skills.every((s) => typeof s === "string" && s.trim())) {
    throw new ApiError(400, "Each skill must be a non-empty string");
  }

  const profile = await CandidateProfile.findOneAndUpdate(
    { candidateId },
    { $addToSet: { skills: { $each: skills.map((s) => s.trim()) } } },
    { new: true }
  );
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  res.json(new ApiResponse(200, profile.skills, "Skills added successfully"));
});

export const removeSkill = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  const { skill } = req.body;

  if (!skill || typeof skill !== "string" || !skill.trim()) {
    throw new ApiError(400, "Skill is required and must be a string");
  }

  const normalizedSkill = skill.trim();

  const profile = await CandidateProfile.findOneAndUpdate(
    { candidateId },
    { $pull: { skills: normalizedSkill } },
    { new: true }
  );

  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  res.json(new ApiResponse(200, profile.skills, "Skill removed successfully"));
});

export const uploadResume = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;
  if (!req.file) {
    throw new ApiError(400, "No resume file uploaded");
  }
  const profile = await CandidateProfile.findOne({ candidateId });

  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  profile.resumeUrl = req.file.secure_url || req.file.path;
  await profile.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resumeUrl: profile.resumeUrl },
        "Resume uploaded successfully"
      )
    );
});

export const deleteResume = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;

  const profile = await CandidateProfile.findOne({ candidateId });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  const resumeUrl = profile.resumeUrl;
  if (!resumeUrl) {
    throw new ApiError(400, "No resume file found to delete");
  }

  const parts = resumeUrl.split("/");
  const fileNameWithExt = parts[parts.length - 1];
  const publicId = `resumes/${fileNameWithExt.split(".")[0]}`;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }

  profile.resumeUrl = undefined;
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume deleted successfully"));
});
