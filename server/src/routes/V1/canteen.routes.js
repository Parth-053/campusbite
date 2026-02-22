import express from "express";
import { getCanteens } from "../../controllers/common/canteen.controller.js";
import { getAdminCanteens, updateCanteen, deleteCanteen, toggleCanteenStatus } from "../../controllers/admin/canteen.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

router.get("/common/:collegeId", getCanteens);

router.use("/admin", verifyToken, authorizeRoles(ROLES.ADMIN));
router.get("/admin", getAdminCanteens);
router.put("/admin/:id", updateCanteen);
router.delete("/admin/:id", deleteCanteen);
router.patch("/admin/:id/status", toggleCanteenStatus);

export default router;