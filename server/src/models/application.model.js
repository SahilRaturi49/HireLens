import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
        "withdrawn",
      ],
      default: "applied",
    },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: "updatedAt" } }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
