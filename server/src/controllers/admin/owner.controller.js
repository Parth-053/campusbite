import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import Owner from "../../models/Owner.js";
import Canteen from "../../models/Canteen.js";  
import { sendOwnerStatusEmail, sendOwnerBanEmail } from "../../services/email.service.js";  

// Admin changes status: pending -> approved / rejected / suspended
export const updateOwnerStatus = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const { status } = req.body;  

  const validStatuses = ["pending", "approved", "rejected", "suspended"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status type.");
  }

  const owner = await Owner.findByIdAndUpdate(ownerId, { status }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");

  // Automatically update their Canteen's active state based on approval
  const isActive = status === 'approved';
  await Canteen.findOneAndUpdate(
    { owner: ownerId },
    { isActive },
    { new: true }
  );

  // Send Status Update Email to the Owner
  await sendOwnerStatusEmail(owner.email, owner.name, status);

  return res.status(200).json(
    new ApiResponse(200, owner, `Owner status successfully updated to ${status} and email sent.`)
  );
});

export const toggleBanOwner = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");

  owner.isBanned = !owner.isBanned;
  await owner.save();

  // Toggle Canteen Active state based on Ban status
  if (owner.isBanned) {
    await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: false });
  } else if (owner.status === 'approved') {
    await Canteen.findOneAndUpdate({ owner: ownerId }, { isActive: true });
  }

  // Send Ban/Unban Email Notification to the Owner
  await sendOwnerBanEmail(owner.email, owner.name, owner.isBanned);

  const actionMsg = owner.isBanned ? "banned" : "unbanned";
  return res.status(200).json(
    new ApiResponse(200, owner, `Owner successfully ${actionMsg} and email sent.`)
  );
});