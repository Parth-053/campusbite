import { transactionalEmailsApi, sendSmtpEmail } from "../config/email.config.js";
import { logger } from "../config/logger.js";

/**
 * Send Email securely using Brevo SDK
 * @param {string} toEmail 
 * @param {string} toName 
 * @param {string} subject 
 * @param {string} htmlContent 
 */
export const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: "CampusBite", email: "campusbite.app07@gmail.com" }; 
    sendSmtpEmail.to = [{ email: toEmail, name: toName }];

    const data = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    logger.info(`✅ Email sent successfully to ${toEmail}. Message ID: ${data.messageId}`);
    return true;
  } catch (error) {
    logger.error(`❌ Error sending email to ${toEmail}: ${error.message}`);
    return false;
  }
};