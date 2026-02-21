import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = [
  "MONGO_URI", 
  "FIREBASE_PROJECT_ID", 
  "FIREBASE_PRIVATE_KEY", 
  "FIREBASE_CLIENT_EMAIL"
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.error(`FATAL SECURITY ERROR: Missing crucial environment variable: ${env}`);
    process.exit(1); 
  }
});

export const envConfig = {
  port: process.env.PORT || 8001,
  env: process.env.NODE_ENV || "development",
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"],
  },
  mongoose: {
    url: process.env.MONGO_URI,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};