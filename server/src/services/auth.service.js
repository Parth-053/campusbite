import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";

// ==================== ADMIN SERVICES ====================
export const adminLoginService = async (firebaseUid) => {
  const admin = await Admin.findOne({ firebaseUid });
  if (!admin) throw new ApiError(404, "Admin profile not found.");
  return admin;
};

// ==================== OWNER SERVICES ====================
export const ownerRegisterService = async (ownerData) => {
  // Check if owner already exists
  const existingOwner = await Owner.findOne({ 
    $or: [{ email: ownerData.email }, { firebaseUid: ownerData.firebaseUid }] 
  });
  if (existingOwner) throw new ApiError(409, "Owner with this email or Firebase UID already exists");

  // Create new owner (Matches strict Owner model schema)
  const newOwner = await Owner.create({
    firebaseUid: ownerData.firebaseUid,
    name: ownerData.name,
    email: ownerData.email,
    phone: ownerData.phone,
    upiId: ownerData.upiId, // Explicitly taken from model
    status: "pending", // Default status as per model
  });
  return newOwner;
};

export const ownerLoginService = async (firebaseUid) => {
  const owner = await Owner.findOne({ firebaseUid });
  if (!owner) throw new ApiError(404, "Owner profile not found.");
  
  // Security Checks based on Owner model
  if (owner.isDeleted) throw new ApiError(403, "Your account has been deleted.");
  if (owner.isBanned) throw new ApiError(403, "Your account is banned by the admin.");
  
  return owner;
};

// ==================== CUSTOMER SERVICES ====================
export const customerRegisterService = async (customerData) => {
  const existingCustomer = await Customer.findOne({ 
    $or: [{ email: customerData.email }, { firebaseUid: customerData.firebaseUid }] 
  });
  if (existingCustomer) throw new ApiError(409, "Customer already exists");

  // Create new customer (Matches strict Customer model schema)
  const newCustomer = await Customer.create({
    firebaseUid: customerData.firebaseUid,
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    gender: customerData.gender,
    academicYear: customerData.academicYear,
    college: customerData.college || null, 
    hostel: customerData.hostel || "",
    roomNo: customerData.roomNo || "",
  });
  return newCustomer;
};

export const customerLoginService = async (firebaseUid) => {
  const customer = await Customer.findOne({ firebaseUid }).populate("college", "name");
  if (!customer) throw new ApiError(404, "Customer profile not found. Please register first.");
  return customer;
};