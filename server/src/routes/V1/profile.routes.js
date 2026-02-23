import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js"; // 🚀 FIXED: Imported Multer
import { ROLES } from "../../constants/roles.js";

// Import Controllers
import { getOwnerProfile, updateOwnerProfile, softDeleteOwnerProfile } from "../../controllers/owner/profile.controller.js";
import { getCustomerProfile, updateCustomerProfile } from "../../controllers/customer/profile.controller.js";

const router = express.Router();
router.use(verifyToken);

// ==========================================
// OWNER PROFILE ROUTES
// ==========================================
router.get("/owner", authorizeRoles(ROLES.OWNER), getOwnerProfile);
// 🚀 FIXED: Added upload middleware here
router.patch("/owner", authorizeRoles(ROLES.OWNER), upload.single("image"), updateOwnerProfile); 
router.delete("/owner", authorizeRoles(ROLES.OWNER), softDeleteOwnerProfile); 

// ==========================================
// CUSTOMER PROFILE ROUTES
// ==========================================
router.get("/customer", authorizeRoles(ROLES.CUSTOMER), getCustomerProfile);
router.patch("/customer", authorizeRoles(ROLES.CUSTOMER), updateCustomerProfile);

export default router;