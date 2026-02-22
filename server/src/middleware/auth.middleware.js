import admin from "../config/firebase.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import Customer from "../models/Customer.js";

/**
 * NAYA MIDDLEWARE: For Registration Only
 */
export const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: Missing or invalid token format");
  }

  const token = authHeader.split(" ")[1];

  try {
    // SECURITY: Verify token validity and expiration via Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user safely to request (Sirf Firebase ka data, DB ka nahi)
    req.user = { 
      firebaseUid: decodedToken.uid,
      uid: decodedToken.uid,
      email: decodedToken.email 
    };
    
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized: Token is invalid or expired");
  }
});

/**
 * Step 1: Verify Firebase Token & Attach Secure User Data
 * (Used for Login and protected routes where user MUST exist in DB)
 */
export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: Missing or invalid token format");
  }

  const token = authHeader.split(" ")[1];

  try {
    // SECURITY: Verify token validity and expiration via Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    
    // We expect the client to send their intended role in headers for faster lookup, 
    // fallback to checking all collections if not provided.
    const requestedRole = req.headers['x-user-role']; 
    let userDoc = null;
    let finalRole = null;

    if (requestedRole === 'admin' || !requestedRole) {
      userDoc = await Admin.findOne({ firebaseUid });
      if (userDoc) finalRole = 'admin';
    }
    
    if (!userDoc && (requestedRole === 'owner' || !requestedRole)) {
      userDoc = await Owner.findOne({ firebaseUid });
      if (userDoc) {
        // SECURITY: Block Banned or Deleted Owners immediately
        if (userDoc.isDeleted) throw new ApiError(403, "Account has been deleted");
        if (userDoc.isBanned) throw new ApiError(403, "Account is suspended by Admin");
        finalRole = 'owner';
      }
    }
    
    if (!userDoc && (requestedRole === 'customer' || !requestedRole)) {
      userDoc = await Customer.findOne({ firebaseUid });
      if (userDoc) finalRole = 'customer';
    }

    if (!userDoc) {
      throw new ApiError(404, "User profile not found in database. Please register.");
    }

    // Attach user safely to request
    req.user = userDoc;
    req.user.role = finalRole;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized: Token is invalid or expired");
  }
});

/**
 * Step 2: Role-Based Access Control (RBAC)
 * Usage: authorizeRoles('admin', 'owner')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: You do not have permission to perform this action");
    }
    next();
  };
};