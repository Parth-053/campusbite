import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Owner', 
    required: true 
  },
  canteen: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Canteen', 
    required: true 
  },
  // The amount owner asked to withdraw (Gross)
  amountRequested: { 
    type: Number, 
    required: true 
  },
  // Platform fee cut from owner (e.g., 10% of requested amount)
  ownerCommissionDeducted: { 
    type: Number, 
    required: true 
  },
  // Final amount that will go to Owner's Bank Account
  netPayable: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Rejected'], 
    default: 'Pending' 
  },
  referenceId: { 
    type: String // Bank transaction reference (updated by Admin later)
  }
}, { timestamps: true });

export default mongoose.model('Withdrawal', withdrawalSchema);