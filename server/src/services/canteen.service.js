import Canteen from "../models/Canteen.js";
import { ApiError } from "../utils/ApiError.js";

// ==========================================
// COMMON (PUBLIC) SERVICES
// ==========================================
export const getCanteensByCollegeService = async (collegeId) => {
  return await Canteen.find({ college: collegeId, isActive: true })
    .populate("college", "name")
    .sort({ name: 1 });
};

// ==========================================
// ADMIN SERVICES
// ==========================================
export const getAllCanteensAdminService = async () => {
  return await Canteen.find()
    .populate({
      path: "college",
      populate: { path: "district", populate: { path: "state" } }
    })
    .populate("hostel", "name")  
    .populate("owner", "name email")  
    .sort({ createdAt: -1 });
};

export const createCanteenService = async (canteenData) => {
  const { name, college, canteenType, hostel } = canteenData;
   
  if (canteenType === 'hostel' && !hostel) {
    throw new ApiError(400, "Hostel selection is required for Hostel Canteens");
  }

  const existingCanteen = await Canteen.findOne({ name, college });
  if (existingCanteen) {
    throw new ApiError(400, "Canteen with this name already exists in this college");
  }
  
  const canteen = await Canteen.create(canteenData);
  return await Canteen.findById(canteen._id).populate("college", "name").populate("hostel", "name");
};

export const updateCanteenService = async (id, canteenData) => {
  if (canteenData.canteenType === 'central') {
    canteenData.hostel = null; 
  }

  const canteen = await Canteen.findByIdAndUpdate(id, canteenData, { new: true })
    .populate("college", "name").populate("hostel", "name");
    
  if (!canteen) throw new ApiError(404, "Canteen not found");
  return canteen;
};

export const deleteCanteenService = async (id) => {
  const canteen = await Canteen.findByIdAndDelete(id);
  if (!canteen) throw new ApiError(404, "Canteen not found");
  return canteen;
};

export const toggleCanteenStatusService = async (id) => {
  const canteen = await Canteen.findById(id);
  if (!canteen) throw new ApiError(404, "Canteen not found");
  
  canteen.isActive = !canteen.isActive;  
  await canteen.save();
  return canteen;
};