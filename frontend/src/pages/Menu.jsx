import React, { useEffect, useState } from 'react';
import api from '../api';
import { useCart } from '../store';

export default function Menu(){
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [veg, setVeg] = useState('all');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState('');
  const add = useCart(s=>s.add);

  const load = async ()=>{
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (veg !== 'all') params.set('veg', veg);
    if (cat) params.set('cat', cat);
    if (sort) params.set('sort', sort);
    const res = await api.get('/api/menu?'+params.toString());
    setItems(res.data);
  };
  useEffect(()=>{ load(); },[]);

  useEffect(()=>{
    const t = setTimeout(load, 300);
    return ()=>clearTimeout(t);
  },[q,veg,cat,sort]);

  const cats = Array.from(new Set(items.map(i=>i.category)));

  return (
    <div className="p-6">
      <div className="card mb-4 grid md:grid-cols-4 gap-2">
        <input className="input" placeholder="Search items" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="select" value={veg} onChange={e=>setVeg(e.target.value)}>
          <option value="all">Veg + Non-veg</option>
          <option value="true">Veg only</option>
          <option value="false">Non-veg only</option>
        </select>
        <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Sort: Default</option>
          <option value="price">Price (low→high)</option>
          <option value="bestseller">Best sellers</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(it=> (
          <div key={it.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{it.name}</h3>
              <span className={`badge ${it.veg ? "border-emerald-500" : "border-rose-500"}`}>{it.veg ? "VEG" : "NON-VEG"}</span>
            </div>
            <div className="opacity-80 text-sm">{it.category}</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-extrabold">₹{it.price_inr}</div>
              <button className="btn" onClick={()=>add(it)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
