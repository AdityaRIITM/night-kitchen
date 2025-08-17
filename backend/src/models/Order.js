import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuId: String,
    name: String,
    qty: Number,
    price_inr: Number,
    veg: Boolean
  }],
  subtotal_inr: Number,
  discount_inr: Number,
  delivery_inr: { type: Number, default: 0 },
  total_inr: Number,
  paymentMethod: { type: String, enum: ['COD','ONLINE'], default: 'COD' },
  paymentStatus: { type: String, enum: ['PENDING','PAID','FAILED'], default: 'PENDING' },
  razorpayOrderId: { type: String },
  status: { type: String, enum: ['PLACED','ACCEPTED','PREPARING','OUT_FOR_DELIVERY','READY','COMPLETED','CANCELLED'], default: 'PLACED' },
  timeline: [{
    status: String,
    at: { type: Date, default: Date.now }
  }],
  pickupPoint: { type: String, default: 'Taramani Gate' }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
