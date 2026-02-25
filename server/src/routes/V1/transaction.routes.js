import express from "express";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { getWalletDetails, requestWithdrawal } from "../../controllers/owner/transaction.controller.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles(ROLES.OWNER));

router.get("/wallet", getWalletDetails);
router.post("/withdraw", requestWithdrawal);

export default router;