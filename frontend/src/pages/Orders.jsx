import React, { useEffect, useState } from 'react';
import api from '../api';
import { io } from 'socket.io-client';

export default function Orders(){
  const [orders, setOrders] = useState([]);

  const load = async ()=>{
    let headers = {};
    try {
      const user = (await import('firebase/auth')).getAuth().currentUser;
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
    } catch {}
    const res = await api.get('/api/orders/mine', { headers });
    setOrders(res.data);
  };

  useEffect(()=>{
    load();
  },[]);

  useEffect(()=>{
    const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:8080');
    orders.forEach(o=> socket.emit('join-order', o._id));
    socket.on('order-update', ({ status })=>{
      load();
    });
    return ()=>socket.close();
  },[orders.length]);

  const badge = (s)=>{
    const map = {
      PLACED: 'bg-slate-600',
      ACCEPTED: 'bg-blue-600',
      PREPARING: 'bg-yellow-600',
      OUT_FOR_DELIVERY: 'bg-amber-700',
      READY: 'bg-emerald-700',
      COMPLETED: 'bg-emerald-900',
      CANCELLED: 'bg-rose-800'
    };
    return `px-2 py-1 rounded-full text-xs ${map[s]||'bg-slate-600'}`;
  };

  return (
    <div className="p-6">
      <div className="grid gap-3">
        {orders.map(o=> (
          <div key={o._id} className="card">
            <div className="flex items-center justify-between">
              <div className="font-bold">Order #{o._id.slice(-6).toUpperCase()}</div>
              <div className={badge(o.status)}>{o.status.replaceAll('_',' ')}</div>
            </div>
            <div className="text-sm opacity-80">{new Date(o.createdAt).toLocaleString()}</div>
            <ul className="text-sm list-disc pl-5 my-2">
              {o.items.map((it,i)=>(<li key={i}>{it.name} × {it.qty}</li>))}
            </ul>
            <div className="font-semibold">Total: ₹{o.total_inr}</div>
            <div className="text-xs opacity-70">Pickup at: {o.pickupPoint}</div>
          </div>
        ))}
        {orders.length === 0 && <div className="opacity-70">No orders yet.</div>}
      </div>
    </div>
  )
}
