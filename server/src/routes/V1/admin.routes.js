import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

import { updateOwnerStatus, toggleBanOwner } from "../../controllers/admin/owner.controller.js";
import { getAllCustomers, getCustomerById, toggleBlockCustomer, deleteCustomer } from "../../controllers/admin/customer.controller.js"; 

const router = express.Router();

// 🚀 FIXED: Grouped middleware for explicit injection
const adminAuth = [verifyToken, authorizeRoles(ROLES.ADMIN)];

// --- OWNER MANAGEMENT ROUTES ---
router.patch("/owners/:ownerId/status", adminAuth, updateOwnerStatus);
router.patch("/owners/:ownerId/ban", adminAuth, toggleBanOwner);  

// --- CUSTOMER MANAGEMENT ROUTES ---
router.get("/customers", adminAuth, getAllCustomers);
router.get("/customers/:id", adminAuth, getCustomerById);
router.patch("/customers/:id/block", adminAuth, toggleBlockCustomer);
router.delete("/customers/:id", adminAuth, deleteCustomer);

export default router;