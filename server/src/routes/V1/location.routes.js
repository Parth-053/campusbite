import express from "express";

import { 
  getStates as getStates, 
  getDistricts as getDistricts, 
  getColleges as getColleges, 
  getHostels as getHostels 
} from "../../controllers/common/location.controller.js";

import {
  getColleges as getAdminColleges,
  addCollege,
  updateCollege,
  deleteCollege,
  toggleCollegeStatus,
  getHostels as getAdminHostels,
  addHostel,
  updateHostel,
  deleteHostel,
  toggleHostelStatus
} from "../../controllers/admin/location.controller.js";

// --- Import Middlewares ---
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

// ===================================================================
//  common
// ===================================================================
router.get("/common/states", getStates);
router.get("/common/districts/:stateId", getDistricts);
router.get("/common/colleges/:districtId", getColleges);
router.get("/common/hostels/:collegeId", getHostels);


// ===================================================================
//  ADMIN PROTECTED ROUTES
// ===================================================================

router.use("/admin", verifyToken, authorizeRoles(ROLES.ADMIN));

// --- College CRUD ---
router.get("/admin/colleges", getAdminColleges);
router.post("/admin/colleges", addCollege);
router.put("/admin/colleges/:id", updateCollege);
router.delete("/admin/colleges/:id", deleteCollege);
router.patch("/admin/colleges/:id/status", toggleCollegeStatus);

// --- Hostel CRUD ---
router.get("/admin/hostels", getAdminHostels);
router.post("/admin/hostels", addHostel);
router.put("/admin/hostels/:id", updateHostel);
router.delete("/admin/hostels/:id", deleteHostel);
router.patch("/admin/hostels/:id/status", toggleHostelStatus);

export default router;