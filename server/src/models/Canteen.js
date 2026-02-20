import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  image: { type: String },
  openingTime: { type: String, required: true }, 
  closingTime: { type: String, required: true }, 
  isOpen: { type: Boolean, default: true },
  gstin: { type: String },
  
  // --- Access Control ---
  allowedHostels: [{ type: String }] 
}, { timestamps: true });

export default mongoose.model('Canteen', canteenSchema);