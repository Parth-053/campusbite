import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getActiveCategoriesService } from "../../services/category.service.js";

export const getOwnerActiveCategories = asyncHandler(async (req, res) => {
  const categories = await getActiveCategoriesService();
  return res.status(200).json(new ApiResponse(200, categories, "Active categories fetched for owner"));
});