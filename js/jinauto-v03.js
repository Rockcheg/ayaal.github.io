'use strict';
(() => {
 const products=()=>Array.isArray(window.products)?window.products:[];
 const list=p=>Array.isArray(p.vehicles)?p.vehicles:[];
 const txt=x=>String(x??'').trim();
 const same=(a,b)=>txt(a).toLowerCase()===txt(b).toLowerCase();
 function selector(id,title){
   const s=document.createElement('select');s.id=id;s.className='input input-select';s.setAttribute('aria-label',title);
   const opt=document.createElement('option');opt.value='all';opt.textContent=title;s.append(opt);return s;
 }
 function addOptions(s,values,keep=false){
   const prev=keep?s.value:'all';
   while(s.options.length>1)s.remove(1);
   [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru')).forEach(value=>{
     const o=document.createElement('option');o.value=value;o.textContent=value;s.append(o);
   });
   s.value=[...s.options].some(o=>o.value===prev)?prev:'all';
 }
 function fixDelivery(){
   document.querySelectorAll('.product-card').forEach(card=>{
     const p=products().find(x=>String(x.id)===card.getAttribute('data-product-id'));
     if(p&&p.deliveryCost==null&&p.deliveryPrice==null){
       const el=card.querySelector('.price-box-delivery .price-value');
       if(el)el.textContent='Уточняется';
     }
   });
 }
 function catalog(){
   const toolbar=document.querySelector('.catalog-toolbar');
   if(!toolbar){fixDelivery();return;}
   const brand=selector('brandFilter','Все марки');
   const model=selector('modelFilter','Все модели');
   toolbar.append(brand,model);
   addOptions(brand,products().flatMap(p=>list(p).map(v=>txt(v.brand))));
   function refreshModels(){
     addOptions(model,products().flatMap(p=>list(p).filter(v=>brand.value==='all'||same(v.brand,brand.value)).map(v=>txt(v.model))),true);
   }
   function filter(){
     let count=0;
     document.querySelectorAll('#catalog-products .product-card').forEach(card=>{
       const p=products().find(x=>String(x.id)===card.getAttribute('data-product-id'));
       if(!p)return;
       const matches=(brand.value==='all'&&model.value==='all')||list(p).some(v=>
         (brand.value==='all'||same(v.brand,brand.value))&&(model.value==='all'||same(v.model,model.value)));
       card.classList.toggle('hidden',!matches);
       if(matches)count++;
     });
     const empty=document.getElementById('emptyState');if(empty)empty.classList.toggle('hidden',count>0);
     fixDelivery();
   }
   brand.addEventListener('change',()=>{refreshModels();filter()});
   model.addEventListener('change',filter);
   toolbar.addEventListener('input',e=>{if(e.target!==brand&&e.target!==model)filter()});
   toolbar.addEventListener('change',e=>{if(e.target!==brand&&e.target!==model)filter()});
   refreshModels();filter();
 }
 function product(){
   const page=document.getElementById('productPage');if(!page)return;
   const id=Number(new URLSearchParams(location.search).get('id'));
   const p=products().find(x=>x.id===id);if(!p)return;
   const info=page.querySelector('.product-page-info');if(!info)return;
   const anchor=info.querySelector('.product-prices');if(!anchor)return;
   if(list(p).length){
     const box=document.createElement('div');box.className='jinauto-compatibility';
     const title=document.createElement('strong');title.textContent='Подходит для автомобилей';
     const ul=document.createElement('ul');
     list(p).forEach(v=>{const li=document.createElement('li');li.textContent=[v.brand,v.model,v.generation,v.years].map(txt).filter(Boolean).join(' · ');ul.append(li)});
     box.append(title,ul);info.insertBefore(box,anchor);
   }
   const opts=[];
   if(Array.isArray(p.variants))p.variants.forEach(group=>{
     if(!Array.isArray(group.values)||!group.values.length)return;
     const label=document.createElement('label');label.className='jinauto-variant-label';
     const title=document.createElement('strong');title.textContent=txt(group.name)||'Вариант';
     const select=document.createElement('select');select.className='input input-select';
     const first=document.createElement('option');first.value='';first.textContent='Выберите вариант';select.append(first);
     group.values.forEach(value=>{const o=document.createElement('option');o.value=txt(value);o.textContent=txt(value);select.append(o)});
     if(group.selected&&group.values.includes(group.selected))select.value=group.selected;
     opts.push({name:txt(group.name),select});
     select.addEventListener('change',updateInquiry);
     label.append(title,select);info.insertBefore(label,anchor);
   });
   const price=info.querySelector('.price-box-delivery .price-value');
   if(price&&p.deliveryCost==null&&p.deliveryPrice==null)price.textContent='Уточняется';
   function updateInquiry(){
     const chosen=opts.filter(x=>x.select.value).map(x=>x.name+': '+x.select.value).join('; ');
     const message='Здравствуйте! Интересует товар: '+p.name+' ('+p.sku+').'+(chosen?' Вариант: '+chosen+'.':'');
     info.querySelectorAll('.product-page-actions a[href]').forEach(a=>{
       if(/wa\.me/.test(a.href))a.href=(window.SITE_LINKS?.whatsapp||'https://wa.me/')+'?text='+encodeURIComponent(message);
       if(/max\.ru/.test(a.href))a.href=(window.SITE_LINKS?.maxProfile||'https://max.ru/')+'?text='+encodeURIComponent(message);
     });
   }
   updateInquiry();
 }
 document.addEventListener('DOMContentLoaded',()=>{catalog();product()});
})();