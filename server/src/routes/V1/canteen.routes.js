import express from "express";

// Import Common Controllers
import { getCanteens } from "../../controllers/common/canteen.controller.js";

// Import Admin Controllers
import {
  getAdminCanteens,
  addCanteen,
  updateCanteen,
  deleteCanteen,
  toggleCanteenStatus
} from "../../controllers/admin/canteen.controller.js";

// Import Middlewares
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

// ===================================================================
// COMMON (PUBLIC) ROUTES
// ===================================================================
router.get("/common/:collegeId", getCanteens);


// ===================================================================
// ADMIN PROTECTED ROUTES
// ===================================================================
router.use("/admin", verifyToken, authorizeRoles(ROLES.ADMIN));

router.get("/admin", getAdminCanteens);
router.post("/admin", addCanteen);
router.put("/admin/:id", updateCanteen);
router.delete("/admin/:id", deleteCanteen);
router.patch("/admin/:id/status", toggleCanteenStatus);

export default router;