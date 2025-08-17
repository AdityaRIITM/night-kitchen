import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { makeAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Student profile completion after phone OTP login
router.post('/complete-profile', async (req,res)=>{
  const { phone, name, hostelAddress } = req.body;
  if (!phone || !name || !hostelAddress) return res.status(400).json({ error:'Missing fields' });
  const user = await User.findOneAndUpdate({ phone }, { name, hostelAddress, isProfileComplete: true }, { new: true });
  res.json({ ok:true, user });
});

// Admin email/password login
router.post('/admin/login', async (req,res)=>{
  const { email, password } = req.body;
  const admin = await User.findOne({ role: 'admin', email });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = makeAdminToken(admin);
  res.json({ token });
});

export default router;
