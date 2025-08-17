import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

router.get('/', async (req,res)=>{
  const { q, veg, cat, sort } = req.query;
  const filter = { available: true };
  if (veg === 'true') filter.veg = true;
  if (veg === 'false') filter.veg = false;
  if (cat) filter.category = cat;
  if (q) filter.name = { $regex: q, $options: 'i' };
  let query = MenuItem.find(filter);
  if (sort === 'price') query = query.sort({ price_inr: 1 });
  if (sort === 'bestseller') query = query.sort({ bestSellerScore: -1 });
  const items = await query.limit(200);
  res.json(items);
});

export default router;
