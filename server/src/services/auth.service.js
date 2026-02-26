import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import Canteen from "../models/Canteen.js"; 
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOTP } from "../utils/helpers.js"; 
import { sendOtpEmail, sendAdminNewOwnerNotification } from "./email.service.js";

const otpStore = new Map();

// ==================== COMMON OTP SERVICES ====================
export const sendOtpService = async (email, name) => {
  const otp = generateOTP();
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); 
  await sendOtpEmail(email, name, otp);
  return true;
};
 
export const resendOtpService = async (email) => {
  let user = await Owner.findOne({ email });
  let name = user ? user.name : null;
 
  if (!user) {
    user = await Customer.findOne({ email });
    name = user ? user.name : "User";
  }
 
  if (!user) {
    throw new ApiError(404, "No account found with this email address.");
  }

  await sendOtpService(email, name);
  return true;
};

export const verifyOtpService = async (email, userOtp) => {
  const record = otpStore.get(email);
  if (!record) throw new ApiError(400, "OTP expired or not requested. Please resend.");
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }
  if (record.otp !== userOtp) throw new ApiError(400, "Invalid OTP.");
  
  otpStore.delete(email);
  return true;
};

// ==================== OWNER SERVICES ====================
export const ownerRegisterService = async (firebaseUid, dataObj) => {
  const existingOwner = await Owner.findOne({ email: dataObj.personal.email });
  if (existingOwner) throw new ApiError(409, "Email is already registered.");

  const newOwner = await Owner.create({
    firebaseUid,
    name: dataObj.personal.name,
    email: dataObj.personal.email,
    phone: dataObj.personal.phone,
    upiId: dataObj.payment.upiId,
    isVerified: false 
  });

  await Canteen.create({
    owner: newOwner._id,
    name: dataObj.canteen.name,
    college: dataObj.canteen.collegeId,
    hostel: dataObj.canteen.hostelId,
    allowedHostels: dataObj.canteen.allowedHostels,
    openingTime: dataObj.canteen.openingTime,
    closingTime: dataObj.canteen.closingTime,
    image: dataObj.image || ""
  });

  await sendOtpService(newOwner.email, newOwner.name);
  await sendAdminNewOwnerNotification(newOwner);

  return newOwner;
};

export const markOwnerEmailVerifiedService = async (firebaseUid) => {
  const owner = await Owner.findOneAndUpdate({ firebaseUid }, { isVerified: true }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");
  return owner;
};

export const ownerLoginService = async (firebaseUid) => {
  const owner = await Owner.findOne({ firebaseUid });
  if (!owner) throw new ApiError(404, "Owner profile not found.");
  if (owner.isDeleted) throw new ApiError(403, "Your account has been deleted.");
  if (owner.isBanned) throw new ApiError(403, "Your account is permanently banned.");
  
  owner.isActive = true;
  await owner.save();
  return owner;
};

// ==================== CUSTOMER SERVICES ====================
export const sendCustomerOtpService = async (email, name) => {
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) throw new ApiError(409, "An account with this email already exists.");
  
  await sendOtpService(email, name);
  return true;
};

export const customerRegisterService = async (customerData) => {
  const existingCustomer = await Customer.findOne({ 
    $or: [{ email: customerData.email }, { firebaseUid: customerData.firebaseUid }] 
  });
  if (existingCustomer) throw new ApiError(409, "Customer already exists");

  const newCustomer = await Customer.create({
    firebaseUid: customerData.firebaseUid, 
    name: customerData.name, 
    email: customerData.email,
    phone: customerData.phone, 
    college: customerData.college || null, 
    hostel: customerData.hostel, 
    roomNo: customerData.roomNo || "",
    isVerified: true 
  });

  return newCustomer;
};

export const customerLoginService = async (firebaseUid) => {
  const customer = await Customer.findOne({ firebaseUid }).populate("college", "name").populate("hostel", "name");
  if (!customer) throw new ApiError(404, "Customer not found");
  if (customer.isDeleted) throw new ApiError(403, "Your account is deleted.");
  if (customer.isBanned) throw new ApiError(403, "Your account is banned.");

  customer.isActive = true;
  await customer.save();
  return customer;
};

// ==================== ADMIN SERVICES ====================

export const adminLoginService = async (firebaseUid) => {

  const admin = await Admin.findOne({ firebaseUid });

  if (!admin) throw new ApiError(404, "Admin profile not found.");

  return admin;

};