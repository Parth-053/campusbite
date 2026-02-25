import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { getDashboardData, toggleCanteenStatus } from "../../controllers/owner/dashboard.controller.js";
import { getAnalyticsData } from "../../controllers/owner/analytics.controller.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles(ROLES.OWNER));

// Dashboard Routes
router.get("/dashboard", getDashboardData);
router.patch("/dashboard/toggle-status", toggleCanteenStatus);

// Analytics Route 
router.get("/analytics", getAnalyticsData);

export default router;