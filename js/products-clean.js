'use strict';
window.products=(Array.isArray(window.products)?window.products:[])
  .filter(p=>p&&Number.isSafeInteger(p.id)&&typeof p.name==='string'&&p.name.trim()&&Number.isFinite(p.price)&&p.price>0)
  .filter((p,i,a)=>a.findIndex(x=>x.id===p.id)===i);
