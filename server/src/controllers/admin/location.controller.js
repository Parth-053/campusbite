import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  getAllCollegesAdminService,
  createCollegeService,
  updateCollegeService,
  deleteCollegeService,
  toggleCollegeStatusService,
  getAllHostelsAdminService,
  createHostelService,
  updateHostelService,
  deleteHostelService,
  toggleHostelStatusService
} from "../../services/location.service.js";

// ==========================================
// COLLEGE MANAGEMENT
// ==========================================

export const getColleges = asyncHandler(async (req, res) => {
  const colleges = await getAllCollegesAdminService();
  return res.status(200).json(new ApiResponse(200, colleges, "All colleges fetched successfully"));
});

export const addCollege = asyncHandler(async (req, res) => {
  const { name, districtId } = req.body;
  const college = await createCollegeService(name, districtId);
  return res.status(201).json(new ApiResponse(201, college, "College added successfully"));
});

export const updateCollege = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, districtId } = req.body;
  
  const updatedCollege = await updateCollegeService(id, name, districtId);
  return res.status(200).json(new ApiResponse(200, updatedCollege, "College updated successfully"));
});

export const deleteCollege = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCollegeService(id);
  
  return res.status(200).json(new ApiResponse(200, null, "College deleted successfully"));
});

export const toggleCollegeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const college = await toggleCollegeStatusService(id);
  return res.status(200).json(new ApiResponse(200, college, `College marked as ${college.isActive ? 'Active' : 'Inactive'}`));
});


// ==========================================
// HOSTEL MANAGEMENT
// ==========================================

export const getHostels = asyncHandler(async (req, res) => {
  const hostels = await getAllHostelsAdminService();
  return res.status(200).json(new ApiResponse(200, hostels, "All hostels fetched successfully"));
});

export const addHostel = asyncHandler(async (req, res) => {
  const { name, collegeId } = req.body;
  const hostel = await createHostelService(name, collegeId);
  return res.status(201).json(new ApiResponse(201, hostel, "Hostel added successfully"));
});

export const updateHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, collegeId } = req.body;
  
  const updatedHostel = await updateHostelService(id, name, collegeId);
  return res.status(200).json(new ApiResponse(200, updatedHostel, "Hostel updated successfully"));
});

export const deleteHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteHostelService(id);
  
  return res.status(200).json(new ApiResponse(200, null, "Hostel deleted successfully"));
});

export const toggleHostelStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostel = await toggleHostelStatusService(id);
  return res.status(200).json(new ApiResponse(200, hostel, `Hostel marked as ${hostel.isActive ? 'Active' : 'Inactive'}`));
});