import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, 
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true }, 
  roomNo: { type: String },
  profileImage: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);