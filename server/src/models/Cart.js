import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },  
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen' },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);