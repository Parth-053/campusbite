import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";

// Validations (which we created earlier)
import { registerOwnerSchema, registerCustomerSchema } from "../../validations/auth.validation.js";

// Controllers
import { loginAdmin } from "../../controllers/admin/auth.controller.js";
import { registerOwner, loginOwner } from "../../controllers/owner/auth.controller.js";
import { registerCustomer, loginCustomer } from "../../controllers/customer/auth.controller.js";

const router = express.Router();

// ==================== ADMIN ROUTES ====================
router.post("/admin/login", verifyToken, authorizeRoles(ROLES.ADMIN), loginAdmin);

// ==================== OWNER ROUTES ====================
// verifyToken checks Firebase validity, validate() checks Joi Schema before hitting controller
router.post("/owner/register", verifyToken, validate(registerOwnerSchema), registerOwner);
router.post("/owner/login", verifyToken, authorizeRoles(ROLES.OWNER), loginOwner);

// ==================== CUSTOMER ROUTES ====================
router.post("/customer/register", verifyToken, validate(registerCustomerSchema), registerCustomer);
router.post("/customer/login", verifyToken, authorizeRoles(ROLES.CUSTOMER), loginCustomer);

export default router;