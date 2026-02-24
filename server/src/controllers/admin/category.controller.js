import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  createCategoryService,
  getAllCategoriesAdminService,
  updateCategoryService,
  deleteCategoryService,
  toggleCategoryStatusService
} from "../../services/category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
  const imagePath = req.file?.path;
  const category = await createCategoryService(req.body, imagePath);
  return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesAdminService();
  return res.status(200).json(new ApiResponse(200, categories, "All categories fetched"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const imagePath = req.file?.path;
  const category = await updateCategoryService(req.params.id, req.body, imagePath);
  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await deleteCategoryService(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

export const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await toggleCategoryStatusService(req.params.id);
  return res.status(200).json(new ApiResponse(200, category, "Category status updated"));
});