import State from "../models/State.js";
import District from "../models/District.js";
import College from "../models/College.js";
import Hostel from "../models/Hostel.js";
import Canteen from "../models/Canteen.js";
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";

// ==========================================================
// 1. PUBLIC READ SERVICES (For Owner & Customer Dropdowns)
// ==========================================================

export const getStatesService = async () => {
  return await State.find().sort({ name: 1 });
};

export const getDistrictsByStateService = async (stateId) => {
  return await District.find({ state: stateId }).sort({ name: 1 });
};

export const getCollegesByDistrictService = async (districtId) => {
  return await College.find({ district: districtId, isActive: true }).sort({ name: 1 });
};

export const getHostelsByCollegeService = async (collegeId) => {
  return await Hostel.find({ college: collegeId, isActive: true }).sort({ name: 1 });
};

// Toggle College Status
export const toggleCollegeStatusService = async (collegeId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");
  
  college.isActive = !college.isActive; // Flip the status
  await college.save();
  return college;
};

// Toggle Hostel Status
export const toggleHostelStatusService = async (hostelId) => {
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) throw new ApiError(404, "Hostel not found");
  
  hostel.isActive = !hostel.isActive; // Flip the status
  await hostel.save();
  return hostel;
};


// ==========================================================
// 2. ADMIN SERVICES FOR COLLEGE (CRUD)
// ==========================================================

// GET ALL COLLEGES (With State and District Info for Admin Table)
export const getAllCollegesAdminService = async () => {
  return await College.find().populate({
    path: 'district',
    select: 'name',
    populate: { path: 'state', select: 'name' }
  }).sort({ createdAt: -1 });
};

// CREATE COLLEGE
export const createCollegeService = async (name, districtId) => {
  const existing = await College.findOne({ name, district: districtId });
  if (existing) throw new ApiError(409, "This College already exists in the selected district.");
  
  return await College.create({ name, district: districtId });
};

// UPDATE COLLEGE
export const updateCollegeService = async (collegeId, name, districtId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  // Check if new name already exists in the same district (excluding current college)
  const duplicate = await College.findOne({ name, district: districtId, _id: { $ne: collegeId } });
  if (duplicate) throw new ApiError(409, "Another College with this name already exists in this district.");

  college.name = name || college.name;
  college.district = districtId || college.district;
  
  await college.save();
  return college;
};

// DELETE COLLEGE (With Dependency Protection)
export const deleteCollegeService = async (collegeId) => {
  // Security Check: Cannot delete if Hostels or Canteens are linked to it
  const linkedHostels = await Hostel.findOne({ college: collegeId });
  const linkedCanteens = await Canteen.findOne({ college: collegeId });
  
  if (linkedHostels || linkedCanteens) {
    throw new ApiError(400, "Cannot delete this college because it has registered Hostels or Canteens. Please delete them first.");
  }

  const deletedCollege = await College.findByIdAndDelete(collegeId);
  if (!deletedCollege) throw new ApiError(404, "College not found");
  
  return deletedCollege;
};


// ==========================================================
// 3. ADMIN SERVICES FOR HOSTEL (CRUD)
// ==========================================================

// GET ALL HOSTELS (With College Info for Admin Table)
export const getAllHostelsAdminService = async () => {
  return await Hostel.find().populate({
    path: 'college',
    select: 'name',
    populate: { path: 'district', select: 'name' } // Optional nested info
  }).sort({ createdAt: -1 });
};

// CREATE HOSTEL
export const createHostelService = async (name, collegeId) => {
  const existing = await Hostel.findOne({ name, college: collegeId });
  if (existing) throw new ApiError(409, "This Hostel already exists in the selected college.");
  
  return await Hostel.create({ name, college: collegeId });
};

// UPDATE HOSTEL
export const updateHostelService = async (hostelId, name, collegeId) => {
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) throw new ApiError(404, "Hostel not found");

  const duplicate = await Hostel.findOne({ name, college: collegeId, _id: { $ne: hostelId } });
  if (duplicate) throw new ApiError(409, "Another Hostel with this name already exists in this college.");

  hostel.name = name || hostel.name;
  hostel.college = collegeId || hostel.college;
  
  await hostel.save();
  return hostel;
};

// DELETE HOSTEL (With Dependency Protection)
export const deleteHostelService = async (hostelId) => {
  // Security Check: Cannot delete if Customers or Canteens are linked to it
  const linkedCustomers = await Customer.findOne({ hostel: hostelId });
  const linkedCanteens = await Canteen.findOne({ 
    $or: [ { hostel: hostelId }, { allowedHostels: hostelId } ] 
  });

  if (linkedCustomers || linkedCanteens) {
    throw new ApiError(400, "Cannot delete this hostel because students or canteens are associated with it.");
  }

  const deletedHostel = await Hostel.findByIdAndDelete(hostelId);
  if (!deletedHostel) throw new ApiError(404, "Hostel not found");

  return deletedHostel;
};