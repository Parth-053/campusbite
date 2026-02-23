import Owner from "../models/Owner.js";
import Canteen from "../models/Canteen.js";
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";

// ==========================================
// OWNER PROFILE SERVICES
// ==========================================
export const getOwnerProfileService = async (ownerId) => {
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new ApiError(404, "Owner profile not found");

  // 🚀 FIXED: Added `strictPopulate: false` to prevent 500 Internal Server Error crashes
  const canteen = await Canteen.findOne({ owner: ownerId })
    .populate({
      path: "college",
      strictPopulate: false,
      populate: [
        { path: "state", select: "name", strictPopulate: false },
        { path: "district", select: "name", strictPopulate: false }
      ]
    })
    .populate("hostel")
    .populate("allowedHostels");

  return { ...owner.toObject(), canteen: canteen || null };
};

export const getCanteenByOwnerIdService = async (ownerId) => {
  return await Canteen.findOne({ owner: ownerId });
};

export const updateOwnerProfileService = async (ownerId, updateData, imagePath) => {
  const { name, phone, upiId, canteenName, openingTime, closingTime, collegeId, hostelId, allowedHostels } = updateData;

  const ownerUpdate = {};
  if (name) ownerUpdate.name = name;
  if (phone) ownerUpdate.phone = phone;
  if (upiId) ownerUpdate.upiId = upiId;

  const updatedOwner = await Owner.findByIdAndUpdate(ownerId, ownerUpdate, { new: true, runValidators: true });
  if (!updatedOwner) throw new ApiError(404, "Owner not found");

  const canteenUpdate = {};
  if (canteenName) canteenUpdate.name = canteenName;
  if (openingTime) canteenUpdate.openingTime = openingTime;
  if (closingTime) canteenUpdate.closingTime = closingTime;
  
  if (collegeId) canteenUpdate.college = collegeId;
  if (hostelId) canteenUpdate.hostel = hostelId;
  if (allowedHostels) {
    canteenUpdate.allowedHostels = Array.isArray(allowedHostels) ? allowedHostels : JSON.parse(allowedHostels || '[]');
  }
  
  if (imagePath) canteenUpdate.image = imagePath; 

  // 🚀 FIXED: Added `strictPopulate: false` here as well
  const updatedCanteen = await Canteen.findOneAndUpdate(
    { owner: ownerId },
    canteenUpdate,
    { new: true, runValidators: true }
  )
  .populate({
    path: "college",
    strictPopulate: false,
    populate: [
      { path: "state", select: "name", strictPopulate: false },
      { path: "district", select: "name", strictPopulate: false }
    ]
  })
  .populate("hostel")
  .populate("allowedHostels");

  return { ...updatedOwner.toObject(), canteen: updatedCanteen || null };
};

export const softDeleteOwnerProfileService = async (ownerId) => {
  const owner = await Owner.findByIdAndUpdate(ownerId, { isDeleted: true, isActive: false }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");
  await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: false });
  return true;
};

// ==========================================
// CUSTOMER PROFILE SERVICES
// ==========================================
export const getCustomerProfileService = async (customerId) => {
  const customer = await Customer.findById(customerId).populate("college", "name");
  if (!customer) throw new ApiError(404, "Customer profile not found");
  return customer;
};

export const updateCustomerProfileService = async (customerId, updateData) => {
  const { name, phone, hostel, roomNo } = updateData;
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId, { name, phone, hostel, roomNo }, { new: true, runValidators: true }
  ).populate("college", "name");

  if (!updatedCustomer) throw new ApiError(404, "Customer not found");
  return updatedCustomer;
};