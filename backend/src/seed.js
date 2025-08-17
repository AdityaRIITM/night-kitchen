import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import MenuItem from './src/models/MenuItem.js';
import Coupon from './src/models/Coupon.js';
import User from './src/models/User.js';

dotenv.config();

const menu = [
  {"id":"BRY001","name":"Hyderabadi Biryani","category":"Biryani","veg":false,"price_inr":160,"weight_g":null,"description":""},
  {"id":"BRY002","name":"Egg Biryani","category":"Biryani","veg":false,"price_inr":140,"weight_g":null,"description":""},
  {"id":"ROL001","name":"Chicken Roll","category":"Rolls","veg":false,"price_inr":120,"weight_g":300,"description":""},
  {"id":"ROL002","name":"Egg Roll","category":"Rolls","veg":false,"price_inr":100,"weight_g":250,"description":""},
  {"id":"ROL003","name":"Paneer Roll","category":"Rolls","veg":true,"price_inr":100,"weight_g":180,"description":""},
  {"id":"SND001","name":"Veg Sandwich","category":"Sandwiches","veg":true,"price_inr":50,"weight_g":null,"description":""},
  {"id":"SND002","name":"Paneer Sandwich","category":"Sandwiches","veg":true,"price_inr":80,"weight_g":null,"description":""},
  {"id":"SND003","name":"Chicken Sandwich","category":"Sandwiches","veg":false,"price_inr":100,"weight_g":null,"description":""},
  {"id":"SND004","name":"Club Veg Sandwich (Large)","category":"Sandwiches","veg":true,"price_inr":100,"weight_g":null,"description":""},
  {"id":"SND005","name":"Club Chicken Sandwich (Large)","category":"Sandwiches","veg":false,"price_inr":130,"weight_g":null,"description":""},
  {"id":"SND006","name":"Egg Sandwich","category":"Sandwiches","veg":false,"price_inr":65,"weight_g":null,"description":""},
  {"id":"SNK001","name":"Samosa","category":"Snacks","veg":true,"price_inr":15,"weight_g":null,"description":""},
  {"id":"SNK002","name":"Kachori","category":"Snacks","veg":true,"price_inr":20,"weight_g":null,"description":""},
  {"id":"SNK003","name":"Jhalmuri","category":"Snacks","veg":true,"price_inr":100,"weight_g":null,"description":""},
  {"id":"BRK001","name":"Poha","category":"Breakfast","veg":true,"price_inr":100,"weight_g":null,"description":""},
  {"id":"BRK002","name":"Boiled Eggs (2 pcs)","category":"Breakfast","veg":false,"price_inr":50,"weight_g":null,"description":""},
  {"id":"BRK003","name":"Bread Butter Jam","category":"Breakfast","veg":true,"price_inr":50,"weight_g":null,"description":""},
  {"id":"BEV001","name":"Masala Tea","category":"Beverages","veg":true,"price_inr":30,"weight_g":null,"description":""}
];

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("Set MONGO_URI");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menu);
  console.log("Menu seeded:", menu.length);

  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code: 'WELCOME50', description:'50% off for new users (max ₹50)', discountPct:50, maxDiscountInr:50, newUsersOnly:true },
    { code: 'NIGHT10', description:'10% off, max ₹30', discountPct:10, maxDiscountInr:30 },
  ]);
  console.log("Coupons seeded");

  // Admin
  const adminEmail = 'admin@dhaba.local';
  const exists = await (await import('./src/models/User.js')).default.findOne({ role:'admin', email: adminEmail });
  if (!exists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await (await import('./src/models/User.js')).default.create({
      role:'admin', email: adminEmail, passwordHash, phone: 'N/A', name: 'Dhaba Admin'
    });
    console.log("Admin created:", adminEmail, "admin123");
  } else {
    console.log("Admin exists");
  }

  await mongoose.disconnect();
  console.log("Done");
}

run().catch(e=>{console.error(e); process.exit(1);});
