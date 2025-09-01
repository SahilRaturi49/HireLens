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
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
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
      required: true,
    },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: "updatedAt" } }
);

applicationSchema.index({ jobId: 1 });
applicationSchema.index({ userId: 1 });

export const Application = mongoose.model("Application", applicationSchema);
