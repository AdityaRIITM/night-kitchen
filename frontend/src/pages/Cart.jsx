import React, { useMemo, useState } from 'react';
import { useCart } from '../store';
import api from '../api';

export default function Cart(){
  const { items, inc, dec, remove, clear } = useCart();
  const [coupon, setCoupon] = useState('');
  const [method, setMethod] = useState('COD');
  const subtotal = useMemo(()=> items.reduce((s,it)=> s + it.price_inr*it.qty, 0), [items]);

  const placeOrder = async ()=>{
    // Retrieve Firebase ID token from current user
    const token = window.localStorage.getItem('fb_id_token'); // fallback if app stored it
    let authHeader = {};
    try {
      const user = (await import('firebase/auth')).getAuth().currentUser;
      if (user) {
        authHeader = { Authorization: `Bearer ${await user.getIdToken()}` };
      } else if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
    } catch {}

    const body = {
      items: items.map(it=>({ menuId: it.id, name: it.name, qty: it.qty, price_inr: it.price_inr, veg: it.veg })),
      couponCode: coupon,
      paymentMethod: method
    };
    const res = await api.post('/api/orders', body, { headers: authHeader });
    const orderId = res.data.orderId;
    if (method === 'ONLINE') {
      const rz = await api.post('/api/payments/create-order', { appOrderId: orderId, amountInr: res.data.total_inr }, { headers: authHeader });
      const rzpOrder = rz.data.razor;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'Night Kitchen',
        description: 'Order Payment',
        order_id: rzpOrder.id,
        handler: async (response)=>{
          await api.post('/api/payments/mark-paid', { appOrderId: orderId, razorpayPaymentId: response.razorpay_payment_id }, { headers: authHeader });
          alert('Payment successful!');
          clear();
          window.location.href = '/orders';
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert('Order placed (COD). Track in Orders.');
      clear();
      window.location.href = '/orders';
    }
  };

  return (
    <div className="p-6">
      <div className="card max-w-3xl mx-auto space-y-3">
        <h2 className="text-xl font-bold">Your Cart</h2>
        {items.length === 0 ? <div>Empty cart.</div> : (
          <>
            {items.map(it=> (
              <div key={it.id} className="flex items-center justify-between border-b border-white/10 py-2">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm opacity-70">₹{it.price_inr} × {it.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn" onClick={()=>dec(it.id)}>-</button>
                  <div>{it.qty}</div>
                  <button className="btn" onClick={()=>inc(it.id)}>+</button>
                  <button className="btn" onClick={()=>remove(it.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input className="input" placeholder="Coupon code (e.g., WELCOME50)" value={coupon} onChange={e=>setCoupon(e.target.value)} />
              <select className="select" value={method} onChange={e=>setMethod(e.target.value)}>
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online (UPI/Cards)</option>
              </select>
            </div>
            <div className="text-right text-xl font-extrabold">Subtotal: ₹{subtotal}</div>
            <div className="text-right">
              <button className="btn" onClick={placeOrder}>Place Order</button>
            </div>
          </>
        )}
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  )
}
