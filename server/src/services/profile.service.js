import Owner from "../models/Owner.js";
import Canteen from "../models/Canteen.js";
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary } from "../utils/cloudinary.util.js";

// ==========================================
// OWNER PROFILE SERVICES
// ==========================================
export const getOwnerProfileService = async (ownerId) => {
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new ApiError(404, "Owner profile not found");

  // Fetch linked canteen with populations
  const canteen = await Canteen.findOne({ owner: ownerId })
    .populate({ path: "college", populate: { path: "district", populate: { path: "state" } } })
    .populate("hostel")
    .populate("allowedHostels");

  // Join Owner and Canteen data
  return { ...owner.toObject(), canteen: canteen || null };
};

export const getCanteenByOwnerIdService = async (ownerId) => {
  return await Canteen.findOne({ owner: ownerId });
};

export const updateOwnerProfileService = async (ownerId, updateData, newImagePath) => {
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
  if (allowedHostels) canteenUpdate.allowedHostels = allowedHostels;

  const existingCanteen = await Canteen.findOne({ owner: ownerId });
  
  if (newImagePath) {
    canteenUpdate.image = newImagePath;
    if (existingCanteen && existingCanteen.image) {
       await deleteFromCloudinary(existingCanteen.image);
    }
  }

  const updatedCanteen = await Canteen.findOneAndUpdate({ owner: ownerId }, canteenUpdate, { new: true, runValidators: true })
    .populate({ path: "college", populate: { path: "district", populate: { path: "state" } } })
    .populate("hostel")
    .populate("allowedHostels");

  return { ...updatedOwner.toObject(), canteen: updatedCanteen || null };
};

export const softDeleteOwnerProfileService = async (ownerId) => {
  const owner = await Owner.findByIdAndUpdate(ownerId, { isDeleted: true }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");
  
  await Canteen.findOneAndUpdate({ owner: ownerId }, { isOpen: false }); 
  return owner;
};

// ==========================================
// CUSTOMER PROFILE SERVICES
// ==========================================
export const getCustomerProfileService = async (customerId) => {
  const customer = await Customer.findOne({ 
    $or: [{ _id: customerId }, { firebaseUid: customerId }],
    isDeleted: { $ne: true } 
  }).populate({ path: "college", populate: { path: "district", populate: { path: "state" } } }).populate("hostel");

  if (!customer) throw new ApiError(404, "Customer profile not found");
  return customer;
};

export const updateCustomerProfileService = async (customerId, updateData, imagePath) => {
  const { name, phone, college, hostel, roomNo } = updateData;
  const customerUpdate = {};
  if (name) customerUpdate.name = name;
  if (phone) customerUpdate.phone = phone;
  if (college) customerUpdate.college = college;
  if (hostel) customerUpdate.hostel = hostel;
  if (roomNo) customerUpdate.roomNo = roomNo;
  if (imagePath) customerUpdate.profileImage = imagePath; 

  const updatedCustomer = await Customer.findOneAndUpdate(
    { $or: [{ _id: customerId }, { firebaseUid: customerId }] },
    customerUpdate, { new: true, runValidators: true }
  ).populate({ path: "college", populate: { path: "district", populate: { path: "state" } } }).populate("hostel");

  if (!updatedCustomer) throw new ApiError(404, "Customer not found");
  return updatedCustomer;
};

export const softDeleteCustomerProfileService = async (customerId) => {
  const customer = await Customer.findOneAndUpdate(
    { $or: [{ _id: customerId }, { firebaseUid: customerId }] },
    { isDeleted: true }, { new: true }
  );
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};