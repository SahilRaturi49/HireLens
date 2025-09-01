import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connect } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import candidateProfileRoutes from "./routes/candidateProfile.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

await connect();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/candidate-profile", candidateProfileRoutes);

app.get("/", (req, res) => {
  res.send("HireLens backend up and running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
