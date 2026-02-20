import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  upiId: { type: String, required: true }, 
  
  // --- Session & Verification ---
  isActive: { type: Boolean, default: false }, // true when logged in, false when logged out
  isVerified: { type: Boolean, default: false }, // true after email verification
  
  // --- Admin Controls ---
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "suspended"], 
    default: "pending", 
    index: true 
  },
  isBanned: { type: Boolean, default: false }, // Admin toggle for ban/unban
  
  // --- Soft Delete ---
  isDeleted: { type: Boolean, default: false } // true if owner deletes their account (soft delete)
  
}, { timestamps: true });

export default mongoose.model('Owner', ownerSchema);