import { errorHandler } from "./middlewares/error.middleware.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import candidateProfileRoutes from "./routes/candidateProfile.route.js";
import recruiterDashboardRoute from "./routes/recruiterDashboard.route.js";
import recruiterRequestRoutes from "./routes/recruiterRequest.route.js";
import savedJobsRoutes from "./routes/savedJobs.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/candidate-profile", candidateProfileRoutes);
app.use("/api/v1/recruiterDashboard", recruiterDashboardRoute);
app.use("/api/v1/recruiter-requests", recruiterRequestRoutes);
app.use("/api/v1/saved-jobs", savedJobsRoutes);

app.get("/", (req, res) => {
  res.send("HireLens backend up and running");
});

app.use(errorHandler);

export { app };
