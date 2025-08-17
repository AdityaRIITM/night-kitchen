import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';

export default function App(){
  const [open, setOpen] = useState(true);

  useEffect(()=>{
    // Compute open status client-side; server also enforces
    const check = ()=>{
      const now = new Date();
      const h = now.getHours();
      const open = (h >= 22 || h < 8);
      setOpen(open);
    };
    check();
    const id = setInterval(check, 60_000);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div>
      <nav className="p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-wide">🌙 Night Kitchen</Link>
        <div className="flex gap-3 text-sm">
          <Link to="/menu" className="underline">Menu</Link>
          <Link to="/orders" className="underline">My Orders</Link>
          <Link to="/admin" className="underline">Admin</Link>
          <Link to="/cart" className="underline">Cart</Link>
        </div>
      </nav>

      <div className={`text-center p-2 ${open ? "bg-emerald-600" : "bg-rose-700"}`}>
        {open ? "Open Now (10 PM – 8 AM)" : "Closed (opens at 10 PM)"}
      </div>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/menu" element={<Menu/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  );
}
