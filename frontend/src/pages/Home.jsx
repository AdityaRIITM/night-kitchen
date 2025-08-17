import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="p-6">
      <div className="card flex flex-col items-center text-center gap-4 py-10">
        <h1 className="text-3xl font-extrabold">Late-night cravings, sorted. 🍽️</h1>
        <p className="opacity-80 max-w-xl">
          Bihari Dhaba specials delivered to Taramani Gate in 10–15 minutes. No packing/surge fees.
          Sweet student discounts and loyalty savings on every order.
        </p>
        <div className="flex gap-3">
          <Link className="btn" to="/menu">Browse Menu</Link>
          <Link className="btn" to="/orders">Track Orders</Link>
        </div>
      </div>
    </div>
  )
}
