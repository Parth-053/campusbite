import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);