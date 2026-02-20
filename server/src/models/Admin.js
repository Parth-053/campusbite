import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);