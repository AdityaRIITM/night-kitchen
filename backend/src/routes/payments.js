import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { verifyStudent } from '../middleware/auth.js';

const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', verifyStudent, async (req,res)=>{
  const { appOrderId, amountInr } = req.body;
  const appOrder = await Order.findOne({ _id: appOrderId, user: req.user._id });
  if (!appOrder) return res.status(404).json({ error: 'Order not found' });

  const opts = { amount: amountInr * 100, currency: "INR", receipt: `nk_${appOrderId}` };
  const razor = await instance.orders.create(opts);
  appOrder.razorpayOrderId = razor.id;
  await appOrder.save();
  res.json({ razor });
});

router.post('/mark-paid', verifyStudent, async (req,res)=>{
  const { appOrderId, razorpayPaymentId } = req.body;
  const appOrder = await Order.findOne({ _id: appOrderId, user: req.user._id });
  if (!appOrder) return res.status(404).json({ error: 'Order not found' });
  // In production, verify signature; omitted here for brevity
  appOrder.paymentStatus = 'PAID';
  await appOrder.save();
  res.json({ ok:true });
});

export default router;
