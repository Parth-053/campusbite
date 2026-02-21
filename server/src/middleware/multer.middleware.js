import multer from "multer";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";  

// Secure temporary directory creation
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // SECURITY: Prevent directory traversal attacks by stripping malicious characters
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '').toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${sanitizedName}`);
  },
});

const fileFilter = (req, file, cb) => {
  // SECURITY: Strict MIME type checking (prevents fake extensions)
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Security Alert: Invalid file format. Only JPG, PNG, and WebP are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5 // Max 5 files per request
  }
});