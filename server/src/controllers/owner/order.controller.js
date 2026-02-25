import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getOwnerOrdersService, 
  updateOrderStatusService 
} from "../../services/order.service.js";

const getOwnerId = (req) => req.user?._id || req.user?.id || req.user?.uid;

export const getOwnerOrders = async (req, res) => {
  try {
    const orders = await getOwnerOrdersService(getOwnerId(req), req.query);
    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updatedOrder = await updateOrderStatusService(req.params.id, getOwnerId(req), status);
    return res.status(200).json(new ApiResponse(200, updatedOrder, `Order marked as ${status}`));
  } catch (error) {
    console.error("🚨 UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};