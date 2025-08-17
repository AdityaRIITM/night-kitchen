import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  description: String,
  discountPct: Number,
  maxDiscountInr: Number,
  newUsersOnly: { type: Boolean, default: false },
  minSubtotalInr: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Coupon', CouponSchema);
