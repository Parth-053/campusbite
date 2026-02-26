import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from "../../controllers/owner/notification.controller.js";

const router = express.Router();
router.use(verifyToken, authorizeRoles(ROLES.OWNER));

router.get("/owner/", getNotifications);
router.patch("/owner/read-all", markAllAsRead);
router.patch("/owner/:id/read", markAsRead);
router.delete("/owner/:id", deleteNotification);

export default router;