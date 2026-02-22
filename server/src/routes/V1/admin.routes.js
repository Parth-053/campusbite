import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { updateOwnerStatus, toggleBanOwner } from "../../controllers/admin/owner.controller.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles(ROLES.ADMIN));

router.patch("/owners/:ownerId/status", updateOwnerStatus);
router.patch("/owners/:ownerId/ban", toggleBanOwner);  

export default router;