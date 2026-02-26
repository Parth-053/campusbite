import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

// General service: 
export const getUserNotificationsService = async (userId, userType) => {
  return await Notification.find({ recipient: userId, recipientModel: userType }).sort({ createdAt: -1 });
};

export const markNotificationAsReadService = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
};

export const markAllNotificationsAsReadService = async (userId) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  return true;
};

export const deleteNotificationService = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
  if (!notification) throw new ApiError(404, "Notification not found");
  return { _id: notificationId };
};