import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipientModel: { 
    type: String, 
    enum: ['Admin', 'Owner', 'Customer'], 
    required: true 
  }, // Tells Mongoose which collection to look at
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);