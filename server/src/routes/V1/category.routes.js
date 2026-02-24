import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { ROLES } from "../../constants/roles.js";

// Import Controllers
import * as adminController from "../../controllers/admin/category.controller.js";
import * as ownerController from "../../controllers/owner/category.controller.js";
import * as customerController from "../../controllers/customer/category.controller.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================
const adminAuth = [verifyToken, authorizeRoles(ROLES.ADMIN)];

router.get("/admin", adminAuth, adminController.getAllCategoriesAdmin);
router.post("/admin", adminAuth, upload.single("image"), adminController.createCategory);
router.put("/admin/:id", adminAuth, upload.single("image"), adminController.updateCategory);
router.delete("/admin/:id", adminAuth, adminController.deleteCategory);
router.patch("/admin/:id/status", adminAuth, adminController.toggleCategoryStatus);

// ==========================================
// OWNER ROUTES
// ==========================================
router.get("/owner/active", verifyToken, authorizeRoles(ROLES.OWNER), ownerController.getOwnerActiveCategories);

// ==========================================
// CUSTOMER / COMMON ROUTES
// ==========================================
router.get("/canteen/:canteenId", verifyToken, customerController.getCanteenCategoriesForCustomer);

export default router;