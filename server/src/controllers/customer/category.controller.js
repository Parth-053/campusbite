import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getCategoriesByCanteenService } from "../../services/category.service.js";

export const getCanteenCategoriesForCustomer = asyncHandler(async (req, res) => {
  const { canteenId } = req.params;
  
  const categories = await getCategoriesByCanteenService(canteenId);
  
  return res.status(200).json(new ApiResponse(200, categories, "Canteen specific categories fetched"));
});