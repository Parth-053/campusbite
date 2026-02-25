import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { 
  getOwnerOrders, 
  updateOrderStatus 
} from "../../controllers/owner/order.controller.js";

const router = express.Router();

// Protect all routes below for OWNER only
router.use(verifyToken, authorizeRoles(ROLES.OWNER));

router.get("/owner", getOwnerOrders);
router.patch("/owner/:id/status", updateOrderStatus);

export default router;