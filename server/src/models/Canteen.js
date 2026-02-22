import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  college: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'College', 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },  

  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Owner' 
  },  
  image: { 
    type: String 
  },
  openingTime: { 
    type: String 
  },  
  closingTime: { 
    type: String 
  },  
  isOpen: { 
    type: Boolean, 
    default: false 
  },  
  gstin: { 
    type: String 
  },
  canteenType: { 
    type: String, 
    enum: ['central', 'hostel'] 
  },  
  hostel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  }, 
  allowedHostels: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  }] 
  
}, { timestamps: true });

export default mongoose.model('Canteen', canteenSchema);