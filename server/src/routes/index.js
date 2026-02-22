import express from "express";
import authRoutes from "./v1/auth.routes.js";
import locationRoutes from "./v1/location.routes.js";
import canteenRoutes from "./v1/canteen.routes.js";

const router = express.Router();

// Mount all Authentication Routes under /api/v1/auth
router.use("/v1/auth", authRoutes);
router.use("/v1/locations", locationRoutes);
router.use("/v1/canteens", canteenRoutes);

export default router;