import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },  
  price: { type: Number, required: true },
  type: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  isAvailable: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true }
}, { timestamps: true });
 
menuSchema.pre('validate', function (next) {
  if (this.name && !this.slug) { 
    const baseSlug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const uniqueSuffix = Math.floor(Math.random() * 10000); 
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});

export default mongoose.model('Menu', menuSchema);