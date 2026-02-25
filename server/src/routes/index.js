import express from "express";
import authRoutes from "./v1/auth.routes.js";
import locationRoutes from "./v1/location.routes.js";
import canteenRoutes from "./v1/canteen.routes.js";
import adminRoutes from "./v1/admin.routes.js";
import profileRoutes from "./v1/profile.routes.js";
import CategoryRoutes  from "./v1/category.routes.js";
import ownerRoutes from "./v1/owner.routes.js";
import menuRoutes from "./v1/menu.routes.js";

const router = express.Router();

// Mount all Routes under /api/v1
router.use("/v1/auth", authRoutes);
router.use("/v1/locations", locationRoutes);
router.use("/v1/canteens", canteenRoutes);
router.use("/v1/admin", adminRoutes);
router.use("/v1/profiles", profileRoutes);
router.use("/v1/categories", CategoryRoutes);
router.use("/v1/owner", ownerRoutes);
router.use("/v1/menu", menuRoutes);

export default router;