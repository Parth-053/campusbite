import { sendEmail } from "../utils/email.util.js";  

/**
 * 1. Sends an OTP email to the Owner/Customer
 */
export const sendOtpEmail = async (toEmail, toName, otp) => {
  const subject = "Your Verification OTP - Campus Canteen";
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4F46E5; text-align: center;">Campus Canteen Verification</h2>
      <p style="font-size: 16px; color: #333;">Hello <strong>${toName}</strong>,</p>
      <p style="font-size: 16px; color: #333;">Thank you for registering with us. Please use the following OTP to verify your email address:</p>
      <div style="background-color: #F3F4F6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="font-size: 32px; color: #1F2937; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="font-size: 14px; color: #666;">This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this email, please ignore it.</p>
    </div>
  `;

  return await sendEmail(toEmail, toName, subject, htmlContent);
};

/**
 * 2. Sends an alert to the Admin when a new Owner registers
 */
export const sendAdminNewOwnerNotification = async (adminEmail, adminName, ownerName, canteenName, ownerEmail, ownerPhone) => {
  const subject = "🔔 Action Required: New Partner Registration";
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #Eab308; text-align: center;">New Partner Registration Pending!</h2>
      <p style="font-size: 16px; color: #333;">Hello <strong>${adminName}</strong>,</p>
      <p style="font-size: 16px; color: #333;">A new canteen owner has registered and is waiting for your approval.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
        <p style="margin: 5px 0;"><strong>👤 Owner Name:</strong> ${ownerName}</p>
        <p style="margin: 5px 0;"><strong>🏬 Canteen Name:</strong> ${canteenName}</p>
        <p style="margin: 5px 0;"><strong>✉️ Email:</strong> ${ownerEmail}</p>
        <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${ownerPhone}</p>
      </div>

      <p style="font-size: 14px; color: #666;">Please login to your Admin Dashboard to review and approve/reject this application.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">Campus Canteen Automated System</p>
    </div>
  `;

  return await sendEmail(adminEmail, adminName, subject, htmlContent);
};

/**
 * 3. Sends an Email when Admin Updates Owner Status (Approve/Reject/Suspend)
 */
export const sendOwnerStatusEmail = async (toEmail, toName, status) => {
  let subject = "";
  let message = "";
  let color = "";

  if (status === 'approved') {
    subject = "🎉 Congratulations! Your Canteen is Approved";
    message = "Great news! Your registration has been approved by the Admin. You can now log in to your dashboard and start managing your canteen.";
    color = "#16A34A"; // Green
  } else if (status === 'rejected') {
    subject = "❌ Registration Update: Application Rejected";
    message = "We regret to inform you that your canteen registration has been rejected by the administration. If you have any questions, please contact support.";
    color = "#DC2626"; // Red
  } else if (status === 'suspended') {
    subject = "⚠️ Account Suspended";
    message = "Your account has been temporarily suspended by the Admin. You will not be able to operate your canteen until further notice.";
    color = "#D97706"; // Orange
  } else {
    return false; // Don't send email for 'pending'
  }
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: ${color}; text-align: center;">Account Status Update</h2>
      <p style="font-size: 16px; color: #333;">Hello <strong>${toName}</strong>,</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
        <p style="font-size: 16px; color: #333; margin: 0;">${message}</p>
      </div>
      <p style="font-size: 14px; color: #666;">Regards,<br/>Campus Canteen Administration</p>
    </div>
  `;

  return await sendEmail(toEmail, toName, subject, htmlContent);
};

/**
 * 4. Sends an Email when Admin Bans or Unbans an Owner
 */
export const sendOwnerBanEmail = async (toEmail, toName, isBanned) => {
  const subject = isBanned ? "🚫 Important: Account Permanently Banned" : "✅ Account Restored: Unbanned";
  const color = isBanned ? "#DC2626" : "#16A34A";
  const message = isBanned
    ? "Your account has been permanently banned due to a violation of our policies. You will no longer be able to access your dashboard or operate your canteen."
    : "Good news! Your account has been unbanned by the Admin. You can now resume your operations by logging into your dashboard.";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: ${color}; text-align: center;">Account Ban Status Update</h2>
      <p style="font-size: 16px; color: #333;">Hello <strong>${toName}</strong>,</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
        <p style="font-size: 16px; color: #333; margin: 0;">${message}</p>
      </div>
      <p style="font-size: 14px; color: #666;">Regards,<br/>Campus Canteen Administration</p>
    </div>
  `;

  return await sendEmail(toEmail, toName, subject, htmlContent);
};