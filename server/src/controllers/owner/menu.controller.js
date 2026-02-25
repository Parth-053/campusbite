import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getMenuItemsService, createMenuItemService, updateMenuItemService, 
  deleteMenuItemService, toggleMenuAvailabilityService 
} from "../../services/menu.service.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";

const getOwnerId = (req) => req.user?._id || req.user?.id || req.user?.uid;

export const getMenuItems = async (req, res) => {
  try { 
    const menus = await getMenuItemsService(getOwnerId(req), req.query);
    return res.status(200).json(new ApiResponse(200, menus, "Menus fetched"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const menuData = { ...req.body };
    
    if (!menuData.name || !menuData.price || !menuData.category) {
      return res.status(400).json({ success: false, message: "Invalid Form Data." });
    }

    menuData.isNonVeg = menuData.isNonVeg === 'true';
    menuData.price = Number(menuData.price);

    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path, "menu");
      menuData.image = uploadRes?.url || "";
    }
    
    const newMenu = await createMenuItemService(ownerId, menuData);
    return res.status(201).json(new ApiResponse(201, newMenu, "Menu created"));
  } catch (error) {
    console.error("🚨 ADD MENU ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const menuData = { ...req.body };
    
    if (menuData.isNonVeg !== undefined) {
      menuData.isNonVeg = menuData.isNonVeg === 'true';
    }
    if (menuData.price !== undefined) {
      menuData.price = Number(menuData.price);
    }

    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path, "menu");
      if(uploadRes) menuData.image = uploadRes.url; 
    }
    
    const updatedMenu = await updateMenuItemService(req.params.id, ownerId, menuData);
    return res.status(200).json(new ApiResponse(200, updatedMenu, "Menu updated"));
  } catch (error) {
    console.error("🚨 UPDATE MENU ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleMenuAvailability = async (req, res) => {
  try {
    const result = await toggleMenuAvailabilityService(req.params.id, getOwnerId(req));
    return res.status(200).json(new ApiResponse(200, result, "Availability toggled"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    await deleteMenuItemService(req.params.id, getOwnerId(req));
    return res.status(200).json(new ApiResponse(200, null, "Menu item deleted"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};