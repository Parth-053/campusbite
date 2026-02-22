import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('College', collegeSchema);