import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getAllCustomersService, 
  getCustomerByIdService, 
  toggleBlockCustomerService, 
  deleteCustomerAdminService 
} from "../../services/users.service.js";

// Admin fetches all registered customers with filters
export const getAllCustomers = asyncHandler(async (req, res) => {
  // 🚀 FIXED: Extract query params for filtering
  const filters = {
    college: req.query.college,
    status: req.query.status
  };

  const customers = await getAllCustomersService(filters);
  return res.status(200).json(new ApiResponse(200, customers, "All customers fetched successfully"));
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await getCustomerByIdService(req.params.id);
  return res.status(200).json(new ApiResponse(200, customer, "Customer fetched successfully"));
});

export const toggleBlockCustomer = asyncHandler(async (req, res) => {
  const customer = await toggleBlockCustomerService(req.params.id);
  const actionMsg = customer.isBanned ? "blocked" : "unblocked";
  return res.status(200).json(new ApiResponse(200, customer, `Customer successfully ${actionMsg}.`));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await deleteCustomerAdminService(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Customer permanently deleted."));
});