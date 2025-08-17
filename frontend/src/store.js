import { create } from 'zustand';

export const useCart = create((set)=> ({
  items: [],
  add(item){
    set((s)=>{
      const idx = s.items.findIndex(x=>x.id===item.id);
      if (idx>=0) {
        const copy = [...s.items];
        copy[idx].qty += 1;
        return { items: copy };
      }
      return { items: [...s.items, { ...item, qty: 1 }] };
    })
  },
  inc(id){ set(s=>({ items: s.items.map(it=> it.id===id ? { ...it, qty: it.qty+1 } : it) }))},
  dec(id){ set(s=>({ items: s.items.map(it=> it.id===id ? { ...it, qty: Math.max(1,it.qty-1) } : it) }))},
  remove(id){ set(s=>({ items: s.items.filter(it=> it.id!==id) }))},
  clear(){ set({ items: [] }) }
}));
