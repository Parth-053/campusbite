import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  razorpayOrderId: { type: String },
  paymentId: { type: String },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);