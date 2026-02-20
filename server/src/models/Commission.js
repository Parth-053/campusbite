import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  
  // Earnings breakdown
  adminEarnings: { type: Number, required: true }, // Total admin cut (Owner commission + Customer fee)
  ownerEarnings: { type: Number, required: true }, // What the owner actually gets
  
  // Owner Side Commission (e.g., Platform fee taken from owner)
  ownerCommissionType: { type: String, enum: ['percentage', 'fixed'], required: true },
  ownerCommissionValue: { type: Number, required: true }, // percentage amount or fixed Rs amount
  
  // Customer Side Commission (e.g., Convenience fee charged to customer)
  customerCommissionType: { type: String, enum: ['percentage', 'fixed'], required: true },
  customerCommissionValue: { type: Number, required: true }, // percentage amount or fixed Rs amount
  
  // Tax
  gstRate: { type: Number, default: 0 }, // GST in percentage (default 0%)
  
  isSettled: { type: Boolean, default: false } // True when Admin pays the Owner
}, { timestamps: true });

export default mongoose.model('Commission', commissionSchema);