import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getAllCanteensAdminService, updateCanteenService, deleteCanteenService, toggleCanteenStatusService } from "../../services/canteen.service.js";

export const getAdminCanteens = asyncHandler(async (req, res) => {
  const canteens = await getAllCanteensAdminService();
  return res.status(200).json(new ApiResponse(200, canteens, "Admin canteens fetched successfully"));
});

export const updateCanteen = asyncHandler(async (req, res) => {
  const updatedCanteen = await updateCanteenService(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedCanteen, "Canteen updated successfully"));
});

export const deleteCanteen = asyncHandler(async (req, res) => {
  await deleteCanteenService(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Canteen deleted successfully"));
});

export const toggleCanteenStatus = asyncHandler(async (req, res) => {
  const canteen = await toggleCanteenStatusService(req.params.id);
  return res.status(200).json(new ApiResponse(200, canteen, `Canteen marked as ${canteen.isActive ? 'Active' : 'Inactive'}`));
});