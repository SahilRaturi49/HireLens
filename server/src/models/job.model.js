import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
const jobSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      index: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.salaryMin;
        },
        message: "salaryMax must be greater than or equal to salaryMin",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (!this.slug) {
    const titleSlug = slugify(this.title, { lower: true });
    const companySlug = slugify(this.companyName, { lower: true });
    const locationSlug = this.location
      ? slugify(this.location, { lower: true })
      : "remote";
    this.slug = `${titleSlug}-at-${companySlug}-in-${locationSlug}-${this._id}`;
  }
  next();
});

export const Job = mongoose.model("Job", jobSchema);
