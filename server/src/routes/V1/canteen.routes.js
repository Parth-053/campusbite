import express from "express";
import { getCanteens } from "../../controllers/common/canteen.controller.js";
import { getAdminCanteens, updateCanteen, deleteCanteen, toggleCanteenStatus } from "../../controllers/admin/canteen.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

// Public Route
router.get("/common/:collegeId", getCanteens);

// 🚀 FIXED: Explicit admin auth injection
const adminAuth = [verifyToken, authorizeRoles(ROLES.ADMIN)];

router.get("/admin", adminAuth, getAdminCanteens);
router.put("/admin/:id", adminAuth, updateCanteen);
router.delete("/admin/:id", adminAuth, deleteCanteen);
router.patch("/admin/:id/status", adminAuth, toggleCanteenStatus);

export default router;