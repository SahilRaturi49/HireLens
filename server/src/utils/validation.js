import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
  role: Joi.string().valid("Recruiter", "Candidate").required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).max(64).required(),
}).or("username", "email");

export const profileValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9+\-()\s]{7,20}$/)
    .optional()
    .allow(null, ""),
  summary: Joi.string().max(1000).optional().allow(null, ""),
  skills: Joi.array().items(Joi.string().max(50)).optional(),
  experience: Joi.array()
    .items(
      Joi.object({
        company: Joi.string().required(),
        role: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
        description: Joi.string().optional().allow(null, ""),
      })
    )
    .optional(),
  education: Joi.array()
    .items(
      Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string().required(),
        fieldOfStudy: Joi.string().optional().allow(null, ""),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
      })
    )
    .optional(),
  resumeUrl: Joi.string().uri().optional().allow(null, ""),
  linkedInUrl: Joi.string().uri().optional().allow(null, ""),
  githubUrl: Joi.string().uri().optional().allow(null, ""),
  portfolioUrl: Joi.string().uri().optional().allow(null, ""),
});

export const experienceSchema = Joi.object({
  company: Joi.string().min(2).max(100).required(),
  role: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional().allow(null),
  description: Joi.string().max(1000).optional().allow("", null),
});

export const educationSchema = Joi.object({
  institution: Joi.string().required(),
  degree: Joi.string().required(),
  fieldOfStudy: Joi.string().optional().allow(null, ""),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional().allow(null),
});
