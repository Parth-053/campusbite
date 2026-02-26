import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getUserNotificationsService, 
  markNotificationAsReadService, 
  markAllNotificationsAsReadService, 
  deleteNotificationService 
} from "../../services/notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  // Pass "Owner" to strictly fetch owner notifications
  const notifications = await getUserNotificationsService(req.user._id, 'Owner');
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched"));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsReadService(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, notification, "Marked as read"));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await markAllNotificationsAsReadService(req.user._id);
  return res.status(200).json(new ApiResponse(200, null, "All marked as read"));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await deleteNotificationService(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, null, "Notification deleted"));
});