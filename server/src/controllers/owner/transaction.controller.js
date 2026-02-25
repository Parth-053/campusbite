import { ApiResponse } from "../../utils/ApiResponse.js";
import { getOwnerWalletService, requestWithdrawalService } from "../../services/transaction.service.js";

const getOwnerId = (req) => req.user?._id || req.user?.id || req.user?.uid;

export const getWalletDetails = async (req, res) => {
  try {
    const data = await getOwnerWalletService(getOwnerId(req));
    return res.status(200).json(new ApiResponse(200, data, "Wallet details fetched"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const withdrawal = await requestWithdrawalService(getOwnerId(req), Number(amount));
    return res.status(201).json(new ApiResponse(201, withdrawal, "Withdrawal requested successfully"));
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};