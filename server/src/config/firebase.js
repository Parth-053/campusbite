import admin from "firebase-admin";
import { envConfig } from "./env.config.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: envConfig.firebase.projectId,
    clientEmail: envConfig.firebase.clientEmail,
    privateKey: envConfig.firebase.privateKey,
  }),
});

export default admin;