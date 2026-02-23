import Owner from "../models/Owner.js";
import Canteen from "../models/Canteen.js";
import Customer from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOwnerStatusEmail, sendOwnerBanEmail } from "./email.service.js"; 

// ==========================================
// ADMIN -> OWNER SERVICES (Existing)
// ==========================================
export const updateOwnerStatusService = async (ownerId, status) => {
  const validStatuses = ["pending", "approved", "rejected", "suspended"];
  if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status type.");
  const owner = await Owner.findByIdAndUpdate(ownerId, { status }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");
  await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: status === 'approved' }, { new: true });
  await sendOwnerStatusEmail(owner.email, owner.name, status);
  return owner;
};

export const toggleBanOwnerService = async (ownerId) => {
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");
  owner.isBanned = !owner.isBanned;
  await owner.save();
  if (owner.isBanned) await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: false });
  else if (owner.status === 'approved') await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: true });
  await sendOwnerBanEmail(owner.email, owner.name, owner.isBanned);
  return owner;
};

// ==========================================
// ADMIN -> CUSTOMER SERVICES (NEW & FILTERED)
// ==========================================
export const getAllCustomersService = async (filters = {}) => {
  // 🚀 FIXED: Backend-side filtering logic
  const query = { isDeleted: { $ne: true } };

  if (filters.college) {
    query.college = filters.college;
  }
  
  if (filters.status && filters.status !== 'All') {
    if (filters.status === 'Active') query.isBanned = { $ne: true };
    if (filters.status === 'Inactive') query.isBanned = true;
  }

  const customers = await Customer.find(query)
    .populate({
      path: "college",
      select: "name district",
      populate: { path: "district", select: "name state", populate: { path: "state", select: "name" } }
    })
    .populate("hostel", "name")
    .sort({ createdAt: -1 });

  return customers;
};

export const getCustomerByIdService = async (customerId) => {
  const customer = await Customer.findOne({ _id: customerId, isDeleted: { $ne: true } })
    .populate("college", "name")
    .populate("hostel", "name");
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};

export const toggleBlockCustomerService = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  customer.isBanned = !customer.isBanned; // Assuming you have isBanned in Customer schema
  await customer.save();
  return customer;
};

export const deleteCustomerAdminService = async (customerId) => {
  const customer = await Customer.findByIdAndUpdate(customerId, { isDeleted: true }, { new: true });
  if (!customer) throw new ApiError(404, "Customer not found");
  return true;
};