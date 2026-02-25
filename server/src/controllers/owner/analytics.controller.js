import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getOwnerAnalyticsService } from "../../services/owner.service.js";

export const getAnalyticsData = asyncHandler(async (req, res) => {
  const ownerId = req.user._id; 
  const analyticsData = await getOwnerAnalyticsService(ownerId, req.query);
  
  return res.status(200).json(new ApiResponse(200, analyticsData, "Analytics data fetched securely"));
});