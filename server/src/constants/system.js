/**
 * System-wide Configuration Constants
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_FILES_COUNT: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/jpg"]
};

export const TIME = {
  OTP_EXPIRY_MINUTES: 5,
  TOKEN_EXPIRY_DAYS: 30
};