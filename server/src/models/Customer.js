import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, 
  hostel: { type: String },
  roomNo: { type: String },
  profileImage: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);