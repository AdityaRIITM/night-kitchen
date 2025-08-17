export function computeLoyaltyDiscount(user, subtotal) {
  // simple: 1% per 100 loyalty points, max 10%
  const pct = Math.min(Math.floor((user.loyaltyPoints || 0) / 100), 10);
  const amount = Math.round((pct / 100) * subtotal);
  return { pct, amount };
}

export function applyCoupon(coupon, subtotal) {
  if (!coupon || !coupon.active) return { amount: 0 };
  if (coupon.minSubtotalInr && subtotal < coupon.minSubtotalInr) return { amount: 0 };
  const raw = Math.round((coupon.discountPct / 100) * subtotal);
  const capped = coupon.maxDiscountInr ? Math.min(raw, coupon.maxDiscountInr) : raw;
  return { amount: capped };
}
