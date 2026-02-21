import express from "express";
import authRoutes from "./v1/auth.routes.js";

const router = express.Router();

// Mount all Authentication Routes under /api/v1/auth
router.use("/v1/auth", authRoutes);

// Future Mountings
// router.use("/v1/canteen", canteenRoutes);
// router.use("/v1/order", orderRoutes);

export default router;