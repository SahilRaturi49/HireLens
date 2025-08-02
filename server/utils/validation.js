import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
    username: Joi.string().min(8).max(64).required(),
    role: Joi.string().valid("Recruiter", "Candidate").required()
});

export const loginSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).max(64).required()
}).or("username", "email");
