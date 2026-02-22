import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Hostel', hostelSchema);