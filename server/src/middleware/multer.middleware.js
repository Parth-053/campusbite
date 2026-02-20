import multer from "multer";
import fs from "fs";
import path from "path";
import { ApiError } from "../utils/ApiError.js";  

// 1. Ensure temp directory exists
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + sanitizedName);
  },
});

// 3. File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Invalid file type. Only JPG, PNG, and WebP are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Max 5 files
  }
});