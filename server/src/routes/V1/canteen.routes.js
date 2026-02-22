import express from "express";

import { upload } from "../../middleware/multer.middleware.js"; 
import { getCanteens } from "../../controllers/common/canteen.controller.js";
import {
  getAdminCanteens,
  addCanteen,
  updateCanteen,
  deleteCanteen,
  toggleCanteenStatus
} from "../../controllers/admin/canteen.controller.js";
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

router.post("/admin", upload.single("image"), addCanteen);
router.put("/admin/:id", upload.single("image"), updateCanteen);

router.delete("/admin/:id", deleteCanteen);
router.patch("/admin/:id/status", toggleCanteenStatus);

export default router;