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
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((i) => i.trim().length > 0),
        message: "requirements cannot contain empty strings",
      },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    responsibilities: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((i) => i.trim().length > 0),
        message: "responsibilities cannot contain empty strings",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
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
          if (value == null || this.salaryMin == null) return true;
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

jobSchema.pre("validate", function (next) {
  if (!this.slug && this.title && this.companyName) {
    const titleSlug = slugify(this.title, { lower: true, strict: true });
    const companySlug = slugify(this.companyName, {
      lower: true,
      strict: true,
    });
    const locationSlug = this.location
      ? slugify(this.location, { lower: true, strict: true })
      : "remote";
    this.slug = `${titleSlug}-at-${companySlug}-in-${locationSlug}-${this._id}`;
  }
  next();
});

jobSchema.index({ title: 1, location: 1, isActive: 1 });

export const Job = mongoose.model("Job", jobSchema);
