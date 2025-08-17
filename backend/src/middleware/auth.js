import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import User from '../models/User.js';

// Initialize Firebase Admin once
let firebaseInitialized = false;
if (!firebaseInitialized) {
  if (process.env.FIREBASE_ADMIN_CREDENTIALS_JSON) {
    const creds = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS_JSON);
    admin.initializeApp({ credential: admin.credential.cert(creds) });
  } else {
    // Will pick up GOOGLE_APPLICATION_CREDENTIALS path if provided
    admin.initializeApp();
  }
  firebaseInitialized = true;
}

export async function verifyStudent(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Firebase ID token' });
    const decoded = await admin.auth().verifyIdToken(token);
    // attach or create user
    let user = await User.findOne({ phone: decoded.phone_number });
    if (!user) {
      user = await User.create({
        phone: decoded.phone_number,
        firebaseUid: decoded.uid,
        isProfileComplete: false
      });
    }
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
}

export function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing JWT' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function makeAdminToken(adminUser) {
  return jwt.sign({ id: adminUser._id, role: 'admin', email: adminUser.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

// Service hours check
export function assertServiceWindow(req, res, next) {
  const start = parseInt(process.env.SERVICE_START_HH || '22', 10);
  const end = parseInt(process.env.SERVICE_END_HH || '8', 10);
  const now = new Date();
  const hour = now.getHours(); // server local tz; for IST deploy use IST
  let open = false;
  if (start < end) open = hour >= start && hour < end;
  else open = (hour >= start) || (hour < end);
  if (!open) return res.status(403).json({ error: 'Service closed. Open 10 PM – 8 AM.' });
  next();
}
