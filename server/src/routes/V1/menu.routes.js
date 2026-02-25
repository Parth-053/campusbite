import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { upload } from "../../middleware/multer.middleware.js"; 
import { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  toggleMenuAvailability 
} from "../../controllers/owner/menu.controller.js";

const router = express.Router();
 
router.use(verifyToken, authorizeRoles(ROLES.OWNER));

router.get("/", getMenuItems);
 
router.post("/", upload.single("image"), createMenuItem); 

router.patch("/:id", upload.single("image"), updateMenuItem);
router.patch("/:id/toggle", toggleMenuAvailability);
router.delete("/:id", deleteMenuItem);

export default router;