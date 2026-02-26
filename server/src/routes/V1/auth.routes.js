import express from "express";
import { verifyToken, verifyFirebaseToken, authorizeRoles } from "../../middleware/auth.middleware.js"; 
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { upload } from "../../middleware/multer.middleware.js"; 

import { registerOwnerSchema, registerCustomerSchema } from "../../validations/auth.validation.js";
import { loginAdmin } from "../../controllers/admin/auth.controller.js";
import { registerOwner, loginOwner, getOwnerProfile, verifyOwnerEmail, resendOtp } from "../../controllers/owner/auth.controller.js";
import { registerCustomer, loginCustomer, sendCustomerOtp, verifyCustomerOtpOnly } from "../../controllers/customer/auth.controller.js";

const router = express.Router();

const parseFormDataPayload = (req, res, next) => {
  try {
    if (req.body.personal && typeof req.body.personal === 'string') req.body.personal = JSON.parse(req.body.personal);
    if (req.body.canteen && typeof req.body.canteen === 'string') req.body.canteen = JSON.parse(req.body.canteen);
    if (req.body.payment && typeof req.body.payment === 'string') req.body.payment = JSON.parse(req.body.payment);
    next();
  } catch (error) { return res.status(400).json({ success: false, message: "Invalid JSON format in Form Data" }); }
};

router.post("/admin/login", verifyToken, authorizeRoles(ROLES.ADMIN), loginAdmin);

// ==========================================
// OWNER ROUTES
// ==========================================
router.post("/owner/register", verifyFirebaseToken, upload.single("image"), parseFormDataPayload, validate(registerOwnerSchema), registerOwner);
router.post("/owner/verify-email", verifyFirebaseToken, verifyOwnerEmail); 
router.post("/owner/resend-otp", verifyFirebaseToken, resendOtp); 

router.post("/owner/login", verifyToken, authorizeRoles(ROLES.OWNER), loginOwner);
router.get("/owner/profile", verifyToken, authorizeRoles(ROLES.OWNER), getOwnerProfile); 

// ==========================================
// CUSTOMER ROUTES
// ==========================================
router.post("/customer/send-otp", sendCustomerOtp); 
router.post("/customer/verify-otp-only", verifyCustomerOtpOnly); 

router.post("/customer/register", verifyFirebaseToken, validate(registerCustomerSchema), registerCustomer); 
router.post("/customer/login", verifyFirebaseToken, loginCustomer); 

export default router;