import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },  
  price: { 
    type: Number, 
    required: true 
  },
  isNonVeg: { 
    type: Boolean, 
    default: false 
  },
  image: { 
    type: String,
    default: "" 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  canteen: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Canteen', 
    required: true 
  }
}, { timestamps: true });
  
menuSchema.pre('validate', function () {
  if (this.name && !this.slug) { 
    const baseSlug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const uniqueSuffix = Math.floor(Math.random() * 10000); 
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
});

export default mongoose.model('Menu', menuSchema);