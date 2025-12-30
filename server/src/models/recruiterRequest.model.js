import mongoose, { Schema } from "mongoose";

const recruiterRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

recruiterRequestSchema.index({ userId: 1 }, { unique: true });
recruiterRequestSchema.index({ status: 1 });

export const RecruiterRequest = mongoose.model(
  "RecruiterRequest",
  recruiterRequestSchema
);
