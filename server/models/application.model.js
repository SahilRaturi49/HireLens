import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
});
