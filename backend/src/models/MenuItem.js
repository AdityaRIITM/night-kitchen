import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: String,
  category: String,
  veg: Boolean,
  price_inr: Number,
  weight_g: Number,
  description: String,
  available: { type: Boolean, default: true },
  bestSellerScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('MenuItem', MenuItemSchema);
