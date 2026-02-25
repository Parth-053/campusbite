import Order from "../models/Order.js";
import Canteen from "../models/Canteen.js";

export const getOwnerOrdersService = async (ownerId, query = {}) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  const { status } = query;
  const filterQuery = { canteen: canteen._id };

  // Advanced Filtering
  if (status && status !== 'All') {
    filterQuery.status = status;
  }

  // Fetch from DB, populated with customer and item details
  return await Order.find(filterQuery)
    .populate("customer", "name email phone profileImage")
    .populate("items.menuItem", "name price isNonVeg image")
    .sort({ createdAt: -1 }); // Newest first
};

export const updateOrderStatusService = async (orderId, ownerId, status) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  const order = await Order.findOne({ _id: orderId, canteen: canteen._id });
  if (!order) throw new Error("Order not found");

  // Validate Status Transitions (Optional but recommended)
  const validStatuses = ['Pending', 'Preparing', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  order.status = status;
  await order.save();

  return await Order.findById(order._id)
    .populate("customer", "name email phone profileImage")
    .populate("items.menuItem", "name price isNonVeg image");
};