import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import Canteen from "../models/Canteen.js"; 
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOTP } from "../utils/helpers.js"; 
import { sendOtpEmail, sendAdminNewOwnerNotification } from "./email.service.js";

const otpStore = new Map();

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
  if (record.otp !== userOtp.toString()) throw new ApiError(400, "Invalid OTP Code. Please try again.");
  
  otpStore.delete(email);
  return true;
};

// ==================== ADMIN SERVICES ====================
export const adminLoginService = async (firebaseUid) => {
  const admin = await Admin.findOne({ firebaseUid });
  if (!admin) throw new ApiError(404, "Admin profile not found.");
  return admin;
};

// ==================== OWNER SERVICES ====================
export const ownerRegisterService = async (firebaseUid, data) => {
  const { personal, canteen, payment, image } = data;

  const existingOwner = await Owner.findOne({ $or: [{ email: personal.email }, { firebaseUid }] });
  if (existingOwner) throw new ApiError(409, "Owner with this email or Firebase UID already exists");

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const newOwner = await Owner.create({
    firebaseUid, name: fullName, email: personal.email, phone: personal.mobile,
    upiId: payment.upiId, status: "pending", isActive: true
  });

  let selectedHostels = canteen.allowedHostels || [];
  
  if (canteen.type === 'hostel' && canteen.hostelId) {
    if (!selectedHostels.includes(canteen.hostelId)) {
      selectedHostels.push(canteen.hostelId);
    }
  }

  await Canteen.create({
    name: canteen.canteenName, 
    college: canteen.college, 
    canteenType: canteen.type,
    hostel: canteen.type === 'hostel' ? canteen.hostelId : null,
    allowedHostels: selectedHostels, 
    image: image || null, 
    openingTime: canteen.openingTime, 
    closingTime: canteen.closingTime, 
    owner: newOwner._id, 
    isActive: true 
  });

  // 1. Send OTP to Owner
  await sendOtpService(personal.email, fullName);

  // 2. Fetch Admin from DB and Send Notification
  const admins = await Admin.find({}); 
  if (admins && admins.length > 0) {
    for (const admin of admins) {
      await sendAdminNewOwnerNotification(
        admin.email, 
        admin.name || "System Admin", 
        fullName, 
        canteen.canteenName, 
        personal.email, 
        personal.mobile
      );
    }
  }

  return newOwner;
};

export const ownerLoginService = async (firebaseUid) => {
  const owner = await Owner.findOne({ firebaseUid });
  if (!owner) throw new ApiError(404, "Owner profile not found.");
  if (!owner.isVerified) throw new ApiError(403, "Please verify your email address to login.");
  if (owner.status === 'pending') throw new ApiError(403, "Your account is currently pending Admin approval.");
  if (owner.status === 'rejected') throw new ApiError(403, "Your registration was rejected by the Admin.");
  if (owner.status === 'suspended') throw new ApiError(403, "Your account has been suspended by Admin.");
  if (owner.isDeleted) throw new ApiError(403, "Your account has been deleted.");
  if (owner.isBanned) throw new ApiError(403, "Your account is permanently banned.");
  
  owner.isActive = true;
  await owner.save();
  return owner;
};

// ==================== CUSTOMER SERVICES ====================
export const customerRegisterService = async (customerData) => {
  const existingCustomer = await Customer.findOne({ 
    $or: [{ email: customerData.email }, { firebaseUid: customerData.firebaseUid }] 
  });
  if (existingCustomer) throw new ApiError(409, "Customer with this email or Firebase UID already exists");

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
 
  await sendOtpService(customerData.email, customerData.name);

  return newCustomer;
};

export const customerLoginService = async (firebaseUid) => {
  const customer = await Customer.findOne({ firebaseUid }).populate("college", "name");
  if (!customer) throw new ApiError(404, "Customer profile not found. Please register first.");
  return customer;
};