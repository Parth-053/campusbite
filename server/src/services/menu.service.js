import Menu from "../models/Menu.js";
import Canteen from "../models/Canteen.js";
import { deleteFromCloudinary } from "../utils/cloudinary.util.js";
 
export const getMenuItemsService = async (ownerId, query = {}) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  const { search, type, category } = query;
   
  const filterQuery = { canteen: canteen._id };
 
  if (search && search.trim() !== '') {
    filterQuery.name = { $regex: search, $options: "i" };
  }
 
  if (type && type !== 'All') {
    filterQuery.isNonVeg = type === 'Non-Veg';
  }
 
  if (category && category !== 'All') {
    filterQuery.category = category;
  }
 
  return await Menu.find(filterQuery)
    .populate("category", "name")
    .sort({ createdAt: -1 });
};

export const createMenuItemService = async (ownerId, menuData) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  const newMenu = new Menu({ ...menuData, canteen: canteen._id });
  await newMenu.save();
  return await Menu.findById(newMenu._id).populate("category", "name");
};

export const updateMenuItemService = async (menuId, ownerId, updateData) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  const menu = await Menu.findOne({ _id: menuId, canteen: canteen._id });
  
  if (!menu) throw new Error("Menu item not found");

  if (updateData.image && menu.image && updateData.image !== menu.image) {
    await deleteFromCloudinary(menu.image);
  }

  Object.assign(menu, updateData);
  await menu.save();
  return await Menu.findById(menu._id).populate("category", "name");
};

export const toggleMenuAvailabilityService = async (menuId, ownerId) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  const menu = await Menu.findOne({ _id: menuId, canteen: canteen._id });
  
  if (!menu) throw new Error("Menu item not found");

  menu.isAvailable = !menu.isAvailable;
  await menu.save();
  return { _id: menu._id, isAvailable: menu.isAvailable };
};

export const deleteMenuItemService = async (menuId, ownerId) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  const menu = await Menu.findOneAndDelete({ _id: menuId, canteen: canteen._id });
  
  if (!menu) throw new Error("Menu item not found");

  if (menu.image) await deleteFromCloudinary(menu.image);
  return { _id: menuId };
};