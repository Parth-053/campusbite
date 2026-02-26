import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'recipientModel' // Dynamic reference
  },
  recipientModel: { 
    type: String, 
    required: true, 
    enum: ['Owner', 'Customer', 'Admin'] 
  },
  type: { 
    type: String, 
    enum: ['Order', 'Wallet', 'System', 'Alert', 'Profile'], 
    default: 'System' 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId  
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);