import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { updateOwnerStatusService, toggleBanOwnerService } from "../../services/users.service.js";

// Admin changes status: pending -> approved / rejected / suspended
export const updateOwnerStatus = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const { status } = req.body;  

  // All logic moved to users.service.js
  const owner = await updateOwnerStatusService(ownerId, status);

  return res.status(200).json(
    new ApiResponse(200, owner, `Owner status successfully updated to ${status} and email sent.`)
  );
});

// Admin bans / unbans owner
export const toggleBanOwner = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  
  // All logic moved to users.service.js
  const owner = await toggleBanOwnerService(ownerId);

  const actionMsg = owner.isBanned ? "banned" : "unbanned";
  return res.status(200).json(
    new ApiResponse(200, owner, `Owner successfully ${actionMsg} and email sent.`)
  );
});