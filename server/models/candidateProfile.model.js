import mongoose, { Schema } from "mongoose";

const experienceSchema = new Schema({
  company: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
  },

  description: {
    type: String,
    required: true,
  },
});

const educationSchema = new Schema({
  institution: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  fieldOfStudy: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
});

const candidateProfileSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    summary: {
      type: String,
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: [experienceSchema],
    education: [educationSchema],
    resumeUrl: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    portfolioUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);
