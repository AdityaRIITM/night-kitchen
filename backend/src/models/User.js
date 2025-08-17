import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, index: true },
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  hostelAddress: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  creditsInr: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  role: { type: String, enum: ['student','admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
