import express from 'express';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import { verifyStudent, assertServiceWindow } from '../middleware/auth.js';
import { computeLoyaltyDiscount, applyCoupon } from '../utils/discounts.js';

const router = express.Router();

// Create order
router.post('/', verifyStudent, assertServiceWindow, async (req,res)=>{
  const { items, couponCode, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });

  const subtotal = items.reduce((s,it)=> s + (it.price_inr * it.qty), 0);
  let discount = 0;

  const user = await User.findById(req.user._id);
  // Coupon
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (coupon?.newUsersOnly && user.createdAt < new Date(Date.now()-7*864e5)) {
      // if not new, deny coupon
      coupon = null;
    }
  }
  const { amount: couponAmt } = applyCoupon(coupon, subtotal);
  // Loyalty
  const { amount: loyaltyAmt, pct } = computeLoyaltyDiscount(user, subtotal);
  discount = couponAmt + loyaltyAmt;

  const total = Math.max(0, subtotal - discount);

  const order = await Order.create({
    user: user._id,
    items,
    subtotal_inr: subtotal,
    discount_inr: discount,
    total_inr: total,
    paymentMethod: paymentMethod || 'COD',
    timeline: [{ status: 'PLACED' }]
  });

  // Increase best seller stats (naive)
  // In a full impl, use aggregation; here we update via counter
  // (left as an exercise to keep this endpoint fast)

  // Notify via socket
  req.app.get('io').to(`order:${order._id}`).emit('order-update', { status: order.status });

  res.json({ orderId: order._id, total_inr: total });
});

// Get my orders
router.get('/mine', verifyStudent, async (req,res)=>{
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Track order
router.get('/:orderId', verifyStudent, async (req,res)=>{
  const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

export default router;
