import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);