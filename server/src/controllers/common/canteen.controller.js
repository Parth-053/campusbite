import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getCanteensByCollegeService } from "../../services/canteen.service.js";

export const getCanteens = asyncHandler(async (req, res) => {
  const { collegeId } = req.params;
  const canteens = await getCanteensByCollegeService(collegeId);
  return res.status(200).json(new ApiResponse(200, canteens, "Canteens fetched successfully"));
});