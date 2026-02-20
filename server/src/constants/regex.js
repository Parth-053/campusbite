/**
 * Centralized Regular Expressions for Validation
 */

// Basic Email Regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Indian Mobile Number (10 Digits)
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

// Indian Pincode (6 Digits)
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

// Indian GSTIN (15 Characters)
// Format: 22AAAAA0000A1Z5
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Strong Password: Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// MongoDB ObjectId (24 Hex Characters)
export const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// URL Validation (Simple)
export const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;