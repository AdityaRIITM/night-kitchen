import express from 'express';
import bcrypt from 'bcryptjs';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Menu CRUD
router.post('/menu', requireAdmin, async (req,res)=>{
  const item = await MenuItem.create(req.body);
  res.json(item);
});
router.put('/menu/:id', requireAdmin, async (req,res)=>{
  const item = await MenuItem.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(item);
});
router.get('/orders', requireAdmin, async (req,res)=>{
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  res.json(orders);
});
router.post('/orders/:orderId/status', requireAdmin, async (req,res)=>{
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.orderId,
    { status, $push: { timeline: { status } } },
    { new: true });
  // Push socket update
  req.app.get('io').to(`order:${order._id}`).emit('order-update', { status: order.status });
  res.json(order);
});

// Simple sales report
router.get('/sales/daily', requireAdmin, async (req,res)=>{
  const since = new Date(); since.setHours(0,0,0,0);
  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, status: { $in: ['READY','COMPLETED'] } } },
    { $group: { _id: null, revenue: { $sum: '$total_inr' }, count: { $sum: 1 } } }
  ]);
  res.json(agg[0] || { revenue:0, count:0 });
});

// create admin user (one-time)
router.post('/bootstrap-admin', async (req,res)=>{
  const { email, password } = req.body;
  const exists = await User.findOne({ role: 'admin', email });
  if (exists) return res.json({ ok:true, message: 'Admin exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ role:'admin', email, passwordHash, phone: 'N/A' });
  res.json({ ok:true });
});

export default router;
