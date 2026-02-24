import Category from "../models/Category.js";
import Menu from "../models/Menu.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

// Helper: Extract publicId from Cloudinary URL for deletion
const extractPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const parts = imageUrl.split('/');
    const fileWithExtension = parts.pop();
    const folder2 = parts.pop(); 
    const folder1 = parts.pop(); 
    const filename = fileWithExtension.split('.')[0];
    return `${folder1}/${folder2}/${filename}`;
  } catch (error) {
    return null;
  }
};

// ==========================================
// ADMIN SERVICES
// ==========================================
export const createCategoryService = async (data, imagePath) => {
  const { name } = data;
  
  const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existingCategory) throw new ApiError(400, "Category with this name already exists");

  let imageUrl = "";
  if (imagePath) {
    const uploadResult = await uploadOnCloudinary(imagePath, "category");
    if (uploadResult) imageUrl = uploadResult.url; 
  }

  const category = await Category.create({ name, image: imageUrl });
  return category;
};

export const getAllCategoriesAdminService = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const updateCategoryService = async (id, data, imagePath) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  if (data.name) category.name = data.name;
  if (data.isActive !== undefined) {
    category.isActive = data.isActive === 'true' || data.isActive === true;
  }

  if (imagePath) {
    if (category.image) {
      const oldPublicId = extractPublicIdFromUrl(category.image);
      if (oldPublicId) await deleteFromCloudinary(oldPublicId);
    }
    const uploadResult = await uploadOnCloudinary(imagePath, "category");
    if (uploadResult) category.image = uploadResult.url;
  }

  await category.save();
  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  if (category.image) {
    const publicId = extractPublicIdFromUrl(category.image);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  await Category.findByIdAndDelete(id);
  return category;
};

export const toggleCategoryStatusService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  
  category.isActive = !category.isActive;
  await category.save();
  return category;
};


// ==========================================
// OWNER SERVICES
// ========================================== 
export const getActiveCategoriesService = async () => {
  return await Category.find({ isActive: true }).sort({ name: 1 });
};


// ==========================================
// CUSTOMER SERVICES   
// ========================================== 
export const getCategoriesByCanteenService = async (canteenId) => { 
  const uniqueCategoryIds = await Menu.distinct("category", { 
    canteen: canteenId, 
  });
 
  const categories = await Category.find({
    _id: { $in: uniqueCategoryIds },
    isActive: true  
  }).sort({ name: 1 });

  return categories;
};