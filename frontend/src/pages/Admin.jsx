import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Admin(){
  const [email, setEmail] = useState('admin@dhaba.local');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);

  const login = async ()=>{
    const res = await api.post('/api/auth/admin/login', { email, password });
    setToken(res.data.token);
    load();
  };

  const load = async ()=>{
    if (!token) return;
    const ordersRes = await api.get('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
    setOrders(ordersRes.data);
  };

  const setStatus = async (id, status)=>{
    await api.post(`/api/admin/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  useEffect(()=>{ if(token) load(); }, [token]);

  return (
    <div className="p-6">
      {!token ? (
        <div className="card max-w-md mx-auto space-y-2">
          <h2 className="text-xl font-bold">Admin Login</h2>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
          <button className="btn" onClick={login}>Login</button>
        </div>
      ):(
        <div className="grid gap-4">
          <div className="card">
            <h3 className="font-bold mb-2">Incoming Orders</h3>
            <div className="grid gap-2">
              {orders.map(o=> (
                <div key={o._id} className="border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">#{o._id.slice(-6).toUpperCase()} — ₹{o.total_inr}</div>
                    <div className="text-xs opacity-70">{new Date(o.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-sm">Status: <span className="opacity-80">{o.status}</span></div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['ACCEPTED','PREPARING','OUT_FOR_DELIVERY','READY','COMPLETED','CANCELLED'].map(s=>
                      <button key={s} className="btn" onClick={()=>setStatus(o._id, s)}>{s}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
