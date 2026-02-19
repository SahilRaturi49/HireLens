import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
      index: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "selected", "rejected"],
      default: "applied",
      index: true,
    },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: "updatedAt" } }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
