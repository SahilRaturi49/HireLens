import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

const upload = multer({ storage });

export default upload;
