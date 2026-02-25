import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getOwnerDashboardDataService, toggleCanteenStatusService } from "../../services/owner.service.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const ownerId = req.user._id; 
  const dashboardData = await getOwnerDashboardDataService(ownerId);
  return res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard data fetched successfully"));
});

export const toggleCanteenStatus = asyncHandler(async (req, res) => {
  const ownerId = req.user._id; 
  const result = await toggleCanteenStatusService(ownerId);
  return res.status(200).json(new ApiResponse(200, result, `Canteen is now ${result.isOpen ? 'Open' : 'Closed'}`));
});