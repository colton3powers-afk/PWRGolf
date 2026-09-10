/* ============================================================
   PWR Golf Co. — site engine
   Static-site version: inventory from data/inventory.js,
   cart / bookings / trade-ins / account in localStorage.
   Swap these functions for real API calls when you go live.
   ============================================================ */
(function(){
  const D = window.PWR_DATA || {used:[],new:[],cats:[],brands:[],cond:{}};
  const I = window.PWR_ICONS;
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money = n => '$' + (Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits: (n%1?2:0), maximumFractionDigits:2});
  const store = {
    get(k,d){ try{ const v=localStorage.getItem('pwr_'+k); return v?JSON.parse(v):d; }catch(e){ return d; } },
    set(k,v){ try{ localStorage.setItem('pwr_'+k, JSON.stringify(v)); }catch(e){} }
  };
  const qs = () => Object.fromEntries(new URLSearchParams(location.search));
  const REL = /\/(guides|admin)\//.test(location.pathname)?'../':'';
  const catName = c => (D.cats.find(x=>x[0]===c)||[c,c])[1];

  /* ---------- inventory (sold-in-store sync) ---------- */
  const soldSet = () => new Set(store.get('sold',[]));
  const all = () => D.used.concat(D.new);
  const live = () => { const s=soldSet(); return all().filter(i=>!s.has(i.sku)); };
  const bySku = sku => all().find(i=>i.sku===sku);
  const condLabel = c => (D.cond[String(c)]||["",""])[0];
  const condClass = c => c>=9?'c9':c>=8?'c8':c>=7?'c7':'c6';

  /* ---------- cart ---------- */
  const cart = {
    items(){ return store.get('cart',[]); },
    save(v){ store.set('cart',v); updateBadge(); },
    add(sku,qty=1){ const c=this.items(); const it=bySku(sku); if(!it) return; const ex=c.find(x=>x.sku===sku);
      if(ex){ if(it.type==='used'){ toast('That one is already in your cart — it is a one-of-one.'); return;} ex.qty+=qty; } else c.push({sku,qty:it.type==='used'?1:qty});
      this.save(c); toast('Added to cart — '+it.brand+' '+it.model); },
    remove(sku){ this.save(this.items().filter(x=>x.sku!==sku)); },
    setQty(sku,q){ const c=this.items(); const ex=c.find(x=>x.sku===sku); if(!ex) return; ex.qty=Math.max(1,q); this.save(c); },
    count(){ return this.items().reduce((a,b)=>a+b.qty,0); },
    subtotal(){ return this.items().reduce((a,b)=>{const it=bySku(b.sku); return a+(it?it.price*b.qty:0);},0); },
    clear(){ this.save([]); }
  };
  function updateBadge(){ $$('.cartcount').forEach(e=>e.textContent=cart.count()); }

  /* ---------- saved / recently viewed ---------- */
  const saved = { list(){return store.get('saved',[]);}, toggle(sku){ let l=this.list(); if(l.includes(sku)){ l=l.filter(x=>x!==sku); toast('Removed from saved clubs'); } else { l.push(sku); toast('Saved — find it under Account'); } store.set('saved',l); return l.includes(sku);} , has(sku){return this.list().includes(sku);} };
  function recent(sku){ let l=store.get('recent',[]).filter(x=>x!==sku); l.unshift(sku); store.set('recent',l.slice(0,12)); }

  /* ---------- toast ---------- */
  let toastEl;
  function toast(msg){ if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl);} toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2600); }

  /* ---------- product card ---------- */
  function specLine(it){
    const p=[];
    if(it.type==='used'){ if(it.loft&&it.loft!=='Standard') p.push(it.loft); if(it.flex&&it.flex!=='—'&&it.flex!=='Wedge') p.push(it.flex); if(it.setComp) p.push(it.setComp.split(' (')[0]); if(it.shaftModel&&it.cat!=='shaft') p.push(it.shaftModel); if(it.length&&it.cat==='putter') p.push(it.length); if(it.dex==='LH') p.push('Left-handed'); }
    else { if(it.setComp) p.push(it.setComp.split(' (')[0]); else if(it.loft) p.push(it.loft); if(it.shaftModel) p.push(it.shaftModel); }
    return p.slice(0,3).join(' · ');
  }
  function isNewArrival(it){ const d=(new Date('2026-09-09')-new Date(it.arrived))/864e5; return d<=5; }
  function card(it){
    const ico = I.byCat[it.cat]||I.accessory;
    const stk=[];
    if(it.find) stk.push('<span class="tag ply">PWR Find</span>');
    if(isNewArrival(it)) stk.push('<span class="tag turf">Just hit the floor</span>');
    if(it.dex==='LH') stk.push('<span class="tag tape">LH</span>');
    if(stk.length<2) stk.push(it.type==='used'?'<span class="tag">Pre-owned</span>':'<span class="tag ghost" style="color:#e9e7df">New</span>');
    const price = it.compare? `<span>${money(it.price)}</span><s>${money(it.compare)}</s>` : `<span>${money(it.price)}</span>`;
    const cond = it.type==='used' ? `<span class="cond"><i class="dot ${condClass(it.cond)}"></i>${it.cond}/10 ${esc(condLabel(it.cond))}</span>` : `<span class="cond"><i class="dot"></i>Brand new</span>`;
    return `<a class="card" href="${REL}club.html?sku=${encodeURIComponent(it.sku)}" data-sku="${esc(it.sku)}">
      <div class="ph">${ico}<div class="stk">${stk.join('')}</div><span class="sku">${esc(it.sku)}</span></div>
      <div class="body"><span class="brand">${esc(it.brand)}</span><span class="name">${esc(it.model)}${it.type==='used'&&it.club&&!it.model.includes(it.club)&&['driver','putter','set','bag','shaft'].indexOf(it.cat)<0?' — '+esc(it.club):''}</span>
      <span class="spec">${esc(specLine(it))}</span>${cond}<div class="price">${price}</div></div></a>`;
  }
  function renderGrid(sel, items, empty='Nothing here right now. Check back — inventory changes daily.'){
    const el = typeof sel==='string'?$(sel):sel; if(!el) return;
    el.innerHTML = items.length? items.map(card).join('') : `<div class="empty" style="grid-column:1/-1">${empty}</div>`;
  }

  /* ---------- header / footer behavior ---------- */
  function initHeader(){
    updateBadge();
    const b=$('.burger'), m=$('nav.mobile'); if(b&&m) b.addEventListener('click',()=>m.classList.toggle('open'));
    const st=$('[data-search-toggle]'), sb=$('.searchbar'); if(st&&sb) st.addEventListener('click',()=>{sb.classList.toggle('open'); if(sb.classList.contains('open')) $('input',sb).focus();});
    // mark active nav
    const here=location.pathname.split('/').pop()||'index.html';
    $$('nav.main a').forEach(a=>{ if(a.getAttribute('href')===here) a.classList.add('on'); });
    // hours: highlight today
    const day=new Date().getDay(); $$('.hours tr').forEach((tr,i)=>{ if(+tr.dataset.day===day) tr.classList.add('today'); });
    // newsletter forms
    $$('form[data-signup]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault(); const em=$('input[type=email]',f).value; const l=store.get('signups',[]); l.push({email:em,when:new Date().toISOString()}); store.set('signups',l); f.innerHTML='<div class="ok">You\'re on the list. First dibs incoming.</div>';}));
    // generic "add to cart" buttons
    document.addEventListener('click',e=>{ const b=e.target.closest('[data-add]'); if(b){ e.preventDefault(); cart.add(b.dataset.add, +(b.dataset.qty||1)); } });
    // demo forms (contact, repair, trade-in etc.)
    $$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{ e.preventDefault(); const data=Object.fromEntries(new FormData(f).entries()); const key=f.dataset.demo; const l=store.get(key,[]); l.push(Object.assign({when:new Date().toISOString()},data)); store.set(key,l); const msg=f.dataset.ok||'Got it. We\'ll get back to you fast.'; f.innerHTML='<div class="ok">'+esc(msg)+'</div>'; }));
    // marquee duplicate
    $$('.marquee div').forEach(d=>{ d.innerHTML+=d.innerHTML; });
  }

  /* ---------- shop / filter engine ---------- */
  const FILTERS = [
    ['brand','Brand',i=>i.brand],
    ['cond','Condition',i=>i.type==='new'?'Brand new':`${i.cond}/10 ${condLabel(i.cond)}`],
    ['dex','Dexterity',i=>i.dex],
    ['flex','Flex',i=>i.flex],
    ['loft','Loft',i=>i.loft],
    ['shaftBrand','Shaft brand',i=>i.shaftBrand],
    ['shaftModel','Shaft model',i=>i.shaftModel],
    ['length','Length',i=>i.length],
    ['lie','Lie',i=>i.lie],
    ['cat','Club type',i=>catName(i.cat)],
    ['setComp','Set composition',i=>i.setComp],
  ];
  function initShop(opts){
    const grid=$('#grid'), fbox=$('#filters'), count=$('#count'), sort=$('#sort'), chips=$('#chips');
    if(!grid) return;
    const q=qs();
    let base = live().filter(opts.base||(()=>true));
    if(/used-clubs\.html$/.test(location.pathname)) base=base.filter(i=>i.type==='used');
    if(q.cat) base=base.filter(i=>i.cat===q.cat);
    if(q.type) base=base.filter(i=>i.type===q.type);
    if(q.brand) base=base.filter(i=>i.brand.toLowerCase()===q.brand.toLowerCase());
    if(q.q){ const t=q.q.toLowerCase(); base=base.filter(i=>[i.brand,i.model,i.club,i.cat,i.shaftModel,i.shaftBrand,i.sku,i.notes].join(' ').toLowerCase().includes(t)); }
    if(q.find) base=base.filter(i=>i.find);
    if(q.new) base=base.filter(isNewArrival);
    if(q.clearance) base=base.filter(i=>i.compare||i.cond<=7);
    const state={sel:{},min:null,max:null};
    const title=$('#shoptitle'); if(title){ if(q.q) title.textContent='Search: “'+q.q+'”'; else if(q.brand) title.textContent=q.brand; else if(q.cat) title.textContent=catName(q.cat)+(q.type==='used'?' — Pre-owned':''); }
    $$('.catpills a').forEach(a=>{ const u=new URL(a.href,location.href); if((u.searchParams.get('cat')||'')===(q.cat||'') && (u.searchParams.get('type')||'')===(q.type||'')) a.classList.add('on'); });

    function apply(){
      let items=base.filter(i=>Object.entries(state.sel).every(([k,vals])=>{ if(!vals.size) return true; const f=FILTERS.find(x=>x[0]===k); return vals.has(f[2](i)); }));
      if(state.min!=null) items=items.filter(i=>i.price>=state.min);
      if(state.max!=null) items=items.filter(i=>i.price<=state.max);
      const s=sort?sort.value:'new';
      items.sort((a,b)=> s==='low'?a.price-b.price : s==='high'?b.price-a.price : s==='cond'?b.cond-a.cond : s==='brand'?a.brand.localeCompare(b.brand) : new Date(b.arrived)-new Date(a.arrived));
      renderGrid(grid,items);
      if(count) count.textContent=items.length+' item'+(items.length===1?'':'s');
      if(chips){ const c=[]; Object.entries(state.sel).forEach(([k,vals])=>vals.forEach(v=>c.push(`<span class="chip" data-k="${k}" data-v="${esc(v)}">${esc(v)} ×</span>`))); if(state.min!=null||state.max!=null) c.push(`<span class="chip" data-k="price">${money(state.min||0)}–${state.max!=null?money(state.max):'∞'} ×</span>`); chips.innerHTML=c.join(''); }
    }
    function buildFilters(){
      let html=`<div class="head"><span class="up">Filters</span><button type="button" id="clearf">Clear all</button></div>`;
      html+=`<details open><summary>Price</summary><div class="range"><input type="number" id="pmin" placeholder="Min" min="0"><span>–</span><input type="number" id="pmax" placeholder="Max"></div></details>`;
      FILTERS.forEach(([k,label,fn],idx)=>{
        const counts={}; base.forEach(i=>{ const v=fn(i); if(v!=null&&v!==''&&v!=='—') counts[v]=(counts[v]||0)+1; });
        const keys=Object.keys(counts); if(keys.length<2 && k!=='brand') return;
        keys.sort((a,b)=> k==='cond'?parseFloat(b)-parseFloat(a) : a.localeCompare(b,undefined,{numeric:true}));
        html+=`<details ${idx<3?'open':''}><summary>${label}</summary><div class="opts">`+keys.map(v=>`<label><input type="checkbox" data-k="${k}" value="${esc(v)}"> ${esc(v)} <span class="cnt">${counts[v]}</span></label>`).join('')+`</div></details>`;
      });
      fbox.innerHTML=html;
      fbox.addEventListener('change',e=>{ const cb=e.target; if(cb.type==='checkbox'){ state.sel[cb.dataset.k]=state.sel[cb.dataset.k]||new Set(); cb.checked?state.sel[cb.dataset.k].add(cb.value):state.sel[cb.dataset.k].delete(cb.value); apply(); } });
      fbox.addEventListener('input',e=>{ if(e.target.id==='pmin'){ state.min=e.target.value===''?null:+e.target.value; apply(); } if(e.target.id==='pmax'){ state.max=e.target.value===''?null:+e.target.value; apply(); } });
      $('#clearf').addEventListener('click',()=>{ state.sel={}; state.min=state.max=null; $$('input',fbox).forEach(i=>{ if(i.type==='checkbox') i.checked=false; else i.value=''; }); apply(); });
    }
    if(fbox) buildFilters();
    if(sort) sort.addEventListener('change',apply);
    if(chips) chips.addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c) return; if(c.dataset.k==='price'){ state.min=state.max=null; $('#pmin').value=''; $('#pmax').value=''; } else { state.sel[c.dataset.k].delete(c.dataset.v); const cb=$$('input[type=checkbox]',fbox).find(x=>x.dataset.k===c.dataset.k&&x.value===c.dataset.v); if(cb) cb.checked=false; } apply(); });
    apply();
  }

  /* ---------- product detail page ---------- */
  function initPDP(){
    const root=$('#pdp'); if(!root) return;
    const it=bySku(qs().sku);
    if(!it){ root.innerHTML='<div class="empty">That club is gone — it either sold or the link is old.<br><br><a class="btn" href="used-clubs.html">See what\'s on the rack</a></div>'; return; }
    const sold=soldSet().has(it.sku);
    recent(it.sku);
    document.title=`${it.brand} ${it.model} — PWR Golf Co.`; const cs=$('#crumb-sku'); if(cs) cs.textContent=it.sku;
    const ico=I.byCat[it.cat]||I.accessory;
    const photos = it.type==='used' ? ['Face','Sole','Crown / topline','Grip','Shaft band'] : ['Product','Address','Sole','Face','Detail'];
    const specs = [
      ['SKU',`<span class="mono">${esc(it.sku)}</span>`],['Condition', it.type==='used'?`${it.cond}/10 — ${condLabel(it.cond)}`:'Brand new'],['Dexterity',it.dex],['Loft',it.loft],['Bounce',it.bounce],['Flex',it.flex],['Shaft',[it.shaftBrand,it.shaftModel].filter(Boolean).join(' ')],['Length',it.length],['Lie',it.lie],['Set composition',it.setComp],['Grip',it.grip],['Grip condition',it.gripCond],['Headcover',it.type==='used'?(it.headcover?'Included':'Not included'):'Included'],['Serial',it.serial],['Model year',it.year],['Trade-in eligible',it.tradeEligible?'Yes — trade this toward anything in the shop':'—'],['Arrived',it.arrived]
    ].filter(r=>r[1]!=null&&r[1]!==''&&r[1]!=='—');
    const isSaved=saved.has(it.sku);
    root.innerHTML=`
      <div class="gallery"><div class="main">${ico}<span class="lbl" id="plbl">${photos[0]} photo — ${esc(it.sku)}</span>${sold?'<div class="sign lg" style="position:absolute">SOLD</div>':''}</div>
        <div class="thumbs">${photos.map((p,i)=>`<button type="button" class="${i?'':'on'}" data-p="${p}">${ico}<span>${p}</span></button>`).join('')}</div>
        ${it.type==='used'?`<p class="small muted" style="margin-top:10px">Photos are of this exact club (SKU ${esc(it.sku)}), not a stock image. If it's not in the photos, ask us and we'll shoot it.</p>`:''}
      </div>
      <div>
        <div class="kicker">${it.type==='used'?'Pre-owned · one of one':'New · in stock'} ${it.find?'· <span style="color:var(--ply-dark)">PWR Find</span>':''}</div>
        <p class="up muted" style="margin:0">${esc(it.brand)}</p>
        <h1 style="font-size:clamp(34px,4.5vw,58px)">${esc(it.model)}${it.type==='used'&&it.club&&!it.model.includes(it.club)&&['driver','putter','set','bag','shaft'].indexOf(it.cat)<0?' <span class="muted">'+esc(it.club)+'</span>':''}</h1>
        <div class="buybox">
          <div class="bigprice">${money(it.price)}${it.compare?`<s>${money(it.compare)}</s>`:''}</div>
          ${it.type==='used'?`<div class="condbar">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<i class="${n<=it.cond?'f':''}"></i>`).join('')}</div><p class="small"><b>${it.cond}/10 ${esc(condLabel(it.cond))}.</b> ${esc((D.cond[String(it.cond)]||['',''])[1])} <a href="condition-guide.html">How we grade →</a></p>`:`<p class="small">Ships in 1–2 business days, or pick up at the shop today. Custom specs? <a href="fitting.html">Get fit first</a> or <a href="custom-builds.html">build it your way</a>.</p>`}
          ${it.notes?`<div class="notebox">“${esc(it.notes)}” <span class="muted">— PWR bench notes</span></div>`:''}
          <div class="flex" style="margin-top:16px">
            ${sold?'<button class="btn" disabled>Sold</button>':`<button class="btn lg" data-add="${esc(it.sku)}">Add to cart</button>`}
            <button class="btn ghost" id="savebtn" type="button" style="border-color:var(--black);color:var(--black)">${isSaved?'★ Saved':'☆ Save'}</button>
          </div>
          <div class="trust"><div>Local pickup — St. Augustine</div><div>30-day returns on used</div><div>Trade-in accepted</div></div>
          ${it.type==='used'?`<p class="small" style="margin-top:14px"><a href="trade-in.html">Have something to trade toward this?</a> Store credit pays more than cash.</p>`:''}
        </div>
        <h3 style="margin-top:28px">Specs</h3>
        <table class="specs">${specs.map(r=>`<tr><td>${r[0]}</td><td>${typeof r[1]==='string'&&r[0]==='SKU'?r[1]:esc(r[1])}</td></tr>`).join('')}</table>
      </div>`;
    $$('.thumbs button',root).forEach(b=>b.addEventListener('click',()=>{ $$('.thumbs button',root).forEach(x=>x.classList.remove('on')); b.classList.add('on'); $('#plbl').textContent=b.dataset.p+' photo — '+it.sku; }));
    $('#savebtn').addEventListener('click',e=>{ e.target.textContent = saved.toggle(it.sku)?'★ Saved':'☆ Save'; });
    // similar clubs
    const sim=live().filter(x=>x.sku!==it.sku && x.cat===it.cat).sort((a,b)=>(b.brand===it.brand)-(a.brand===it.brand) || Math.abs(a.price-it.price)-Math.abs(b.price-it.price)).slice(0,4);
    renderGrid('#similar',sim);
  }

  /* ---------- cart page ---------- */
  function initCart(){
    const root=$('#cartlines'); if(!root) return;
    const promo={PWRFINDS:.1, JAGUAR:.05, FIRSTBAG:.15};
    function draw(){
      const items=cart.items();
      if(!items.length){ root.innerHTML='<div class="empty">Your cart is empty.<br><br><a class="btn" href="used-clubs.html">Go find something</a></div>'; $('#summary').style.display='none'; return; }
      root.innerHTML=items.map(l=>{ const it=bySku(l.sku); if(!it) return ''; const ico=I.byCat[it.cat]||I.accessory; return `<div class="line"><div class="ph">${ico}</div><div><div class="up muted small">${esc(it.brand)} · ${it.type==='used'?'Pre-owned':'New'}</div><div class="up" style="font-size:20px">${esc(it.model)}</div><div class="small muted mono">${esc(it.sku)}${it.type==='used'?' · one of one':''}</div>
        <div class="flex" style="margin-top:8px;gap:8px">${it.type==='used'?'<span class="tag gray">Qty 1</span>':`<span class="qty"><button data-q="-1" data-sku="${it.sku}">−</button><span>${l.qty}</span><button data-q="1" data-sku="${it.sku}">+</button></span>`}<button class="btn sm ghost" style="border-color:#999;color:#555" data-rm="${it.sku}">Remove</button></div></div>
        <div class="up right" style="font-size:22px">${money(it.price*l.qty)}</div></div>`; }).join('');
      const sub=cart.subtotal(); const code=(store.get('promo','')||'').toUpperCase(); const disc=promo[code]?sub*promo[code]:0;
      const ship = $('input[name=ship]:checked')?$('input[name=ship]:checked').value:'pickup';
      const shipCost = ship==='pickup'?0 : (sub-disc)>=150?0 : items.some(l=>['iron','set','bag'].includes(bySku(l.sku).cat))?24.99:12.99;
      const tax=(sub-disc)*0.065;
      $('#s-sub').textContent=money(sub); $('#s-disc').textContent=disc?'−'+money(disc):'—'; $('#s-ship').textContent=ship==='pickup'?'Free (St. Augustine)':shipCost?money(shipCost):'Free'; $('#s-tax').textContent=money(tax); $('#s-total').textContent=money(sub-disc+shipCost+tax);
      $('#promo-msg').textContent = code ? (promo[code]?`Code ${code} applied.`:`Code ${code} isn't valid.`) : '';
    }
    root.addEventListener('click',e=>{ const q=e.target.closest('[data-q]'); if(q){ const l=cart.items().find(x=>x.sku===q.dataset.sku); cart.setQty(q.dataset.sku,l.qty+ +q.dataset.q); draw(); } const r=e.target.closest('[data-rm]'); if(r){ cart.remove(r.dataset.rm); draw(); } });
    $$('input[name=ship]').forEach(r=>r.addEventListener('change',draw));
    const pf=$('#promoform'); if(pf) pf.addEventListener('submit',e=>{ e.preventDefault(); store.set('promo',$('input',pf).value.trim()); draw(); });
    draw();
  }

  /* ---------- checkout page ---------- */
  function initCheckout(){
    const f=$('#checkout'); if(!f) return;
    const items=cart.items(); if(!items.length){ f.innerHTML='<div class="empty">Nothing to check out. <a href="shop.html">Shop</a></div>'; return; }
    $('#co-lines').innerHTML=items.map(l=>{const it=bySku(l.sku); return `<div class="row"><span>${esc(it.brand)} ${esc(it.model)} × ${l.qty}</span><span>${money(it.price*l.qty)}</span></div>`;}).join('');
    $('#co-total').textContent=money(cart.subtotal()*1.065);
    f.addEventListener('submit',e=>{ e.preventDefault(); const d=Object.fromEntries(new FormData(f).entries()); const orders=store.get('orders',[]); const id='PWR-'+String(10000+orders.length+1); orders.push({id,when:new Date().toISOString(),items,total:cart.subtotal()*1.065,ship:d.ship||'pickup',name:d.name}); store.set('orders',orders); cart.clear(); $('#checkout-wrap').innerHTML=`<div class="ok" style="font-size:26px">Order ${id} placed</div><p class="lead" style="margin-top:20px">${d.ship==='ship'?'We\'ll email tracking once it\'s boxed up — usually within a day.':'We\'ll text you the second it\'s ready at the counter. Usually within the hour during store hours.'}</p><p><a class="btn" href="account.html">View order</a> <a class="btn ghost" style="color:var(--black)" href="shop.html">Keep shopping</a></p>`; });
    $$('[data-express]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.express+' — wired up at launch via your payment provider')));
  }

  /* ---------- trade-in estimator ---------- */
  const TRADE = {
    "TaylorMade":{"Qi35 Driver":320,"Qi10 Max Driver":240,"Stealth 2 Driver":140,"Stealth Driver":100,"SIM2 Driver":80,"P790 (2023) Irons":520,"P770 Irons":460,"P7MC Irons":480,"Stealth 3 Wood":110,"Spider Tour Putter":150,"MG4 Wedge":55},
    "Titleist":{"GT3 Driver":360,"TSR3 Driver":250,"TSR2 Driver":230,"TSi3 Driver":140,"TSi2 Driver":120,"T100 (2023) Irons":540,"T150 Irons":540,"T200 (2023) Irons":480,"T200 (2021) Irons":320,"TSR2 3 Wood":150,"Vokey SM10 Wedge":80,"Vokey SM9 Wedge":50},
    "Callaway":{"Elyte Driver":320,"Paradym Ai Smoke Driver":220,"Paradym Driver":170,"Rogue ST Driver":110,"Apex Pro 24 Irons":520,"Apex 21 Irons":300,"Apex Pro 21 Irons":320,"Jaws Raw Wedge":45},
    "Ping":{"G440 Max Driver":330,"G430 Max Driver":220,"G430 LST Driver":230,"G425 Max Driver":140,"i230 Irons":520,"i525 Irons":420,"G430 Irons":450,"G430 3 Wood":130,"Glide 4.0 Wedge":45,"PLD Anser Putter":200},
    "Cobra":{"DS-ADAPT Driver":280,"Darkspeed Driver":180,"Aerojet Driver":120,"King Tour Irons":380,"King Forged Tec Irons":300},
    "Mizuno":{"JPX 925 Irons":560,"JPX 923 Forged Irons":420,"JPX 923 Hot Metal Irons":350,"Pro 245 Irons":500,"Pro 243 Irons":520},
    "Srixon":{"ZXi7 Irons":540,"ZX7 Mk II Irons":420,"ZX5 Mk II Irons":400,"ZX7 Irons":300},
    "Scotty Cameron":{"Studio Style Newport 2":300,"Special Select Newport 2":220,"Phantom 5.5 / 7":240,"Newport 2 (2018)":200,"Select Newport (2016)":170},
    "Odyssey":{"Ai-One Jailbird":130,"White Hot OG":80,"Tri-Hot 5K":120,"2-Ball Ten":70},
    "PXG":{"0311 GEN7 Irons":500,"0311 GEN6 Irons":420,"0311 GEN5 Irons":320,"Black Ops Driver":200},
    "Other / not listed":{"Driver":80,"Fairway wood":50,"Hybrid":40,"Iron set":200,"Wedge":25,"Putter":50,"Full bag":300}
  };
  const CONDMULT = {"9.5":1.15,"9":1.0,"8":0.85,"7":0.7,"6":0.5};
  function initTrade(){
    const bsel=$('#t-brand'); if(!bsel) return;
    const msel=$('#t-model'), csel=$('#t-cond'), out=$('#t-out');
    bsel.innerHTML='<option value="">Pick a brand</option>'+Object.keys(TRADE).map(b=>`<option>${b}</option>`).join('');
    bsel.addEventListener('change',()=>{ msel.innerHTML='<option value="">Pick a model</option>'+Object.keys(TRADE[bsel.value]||{}).map(m=>`<option>${m}</option>`).join(''); msel.disabled=!bsel.value; calc(); });
    [msel,csel].forEach(s=>s.addEventListener('change',calc));
    function calc(){ const base=(TRADE[bsel.value]||{})[msel.value]; const m=CONDMULT[csel.value]; if(!base||!m){ out.style.display='none'; return; }
      const cash=Math.round(base*m/5)*5, credit=Math.round(cash*1.2/5)*5; out.style.display='grid';
      $('#t-cash').textContent=money(cash); $('#t-credit').textContent=money(credit); $('#t-what').textContent=`${bsel.value} ${msel.value} · ${csel.options[csel.selectedIndex].text}`;
      store.set('lasttrade',{brand:bsel.value,model:msel.value,cond:csel.value,cash,credit,when:new Date().toISOString()}); }
    const tf=$('#tradeform'); if(tf) tf.addEventListener('submit',e=>{ e.preventDefault(); const d=Object.fromEntries(new FormData(tf).entries()); const l=store.get('tradeins',[]); l.push(Object.assign({when:new Date().toISOString(),status:'Quote requested'},store.get('lasttrade',{}),d)); store.set('tradeins',l); tf.innerHTML='<div class="ok">Quote request in. We\'ll confirm the number within a day — bring it by or reply with photos.</div>'; });
  }

  /* ---------- booking ---------- */
  const SVC = {
    "Driver fitting":{price:100,dur:60},"Iron fitting":{price:100,dur:60},"Wedge fitting":{price:75,dur:45},"Putter fitting":{price:75,dur:45},"Full bag fitting":{price:250,dur:150},
    "Repair consultation":{price:0,dur:20},"Lesson (45 min)":{price:85,dur:45}
  };
  function initBooking(){
    const root=$('#booking'); if(!root) return;
    const q=qs(); const sel=$('#b-svc'); sel.innerHTML=Object.entries(SVC).map(([k,v])=>`<option ${q.svc===k?'selected':''}>${k}</option>`).join('');
    const date=$('#b-date'); const today=new Date(); date.min=today.toISOString().slice(0,10); date.value=q.date||new Date(today.getTime()+864e5).toISOString().slice(0,10);
    const slots=$('#b-slots'); let chosen=null;
    function drawSlots(){ const d=new Date(date.value+'T12:00'); const dow=d.getDay(); const hrs=dow===0?[]:dow===6?[9,10,11,12,13,14,15,16]:[10,11,12,13,14,15,16,17,18];
      const booked=store.get('bookings',[]).filter(b=>b.date===date.value).map(b=>b.time);
      const seed=(date.value.replace(/-/g,'')*7)%13; slots.innerHTML=hrs.length?hrs.map((h,i)=>{ const t=(h%12||12)+(h<12?':00 AM':':00 PM'); const taken=booked.includes(t)||((i*3+seed)%7===0); return `<button type="button" ${taken?'disabled':''} data-t="${t}" class="${chosen===t?'on':''}">${t}</button>`;}).join(''):'<p class="muted">Closed Sundays. Pick another day.</p>';
      $('#b-info').innerHTML=`<b>${sel.value}</b> · ${SVC[sel.value].dur} min · ${SVC[sel.value].price?money(SVC[sel.value].price):'Free'}${sel.value.includes('fitting')?' <span class="tag turf">Fee credited toward clubs</span>':''}`; }
    slots.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||b.disabled) return; chosen=b.dataset.t; drawSlots(); });
    date.addEventListener('change',()=>{chosen=null;drawSlots();}); sel.addEventListener('change',drawSlots); drawSlots();
    root.addEventListener('submit',e=>{ e.preventDefault(); if(!chosen){ toast('Pick a time slot first'); return; } const d=Object.fromEntries(new FormData(root).entries()); const l=store.get('bookings',[]); const id='BK-'+String(5000+l.length+1); l.push({id,svc:sel.value,date:date.value,time:chosen,players:d.players,name:d.name,phone:d.phone,notes:d.notes,when:new Date().toISOString()}); store.set('bookings',l); root.innerHTML=`<div class="ok">Booked — ${id}</div><p class="lead" style="margin-top:16px">${esc(sel.value)} on ${date.value} at ${chosen}. We'll text ${esc(d.phone||'you')} a reminder the day before. See it under <a href="account.html#bookings">Account → Bookings</a>.</p>`; });
  }

  /* ---------- custom build configurator ---------- */
  function initBuild(){
    const f=$('#buildform'); if(!f) return;
    const prices={head:{"Bring your own head":0,"Titleist GT3 head":499,"TaylorMade Qi35 head":449,"Callaway Elyte TD head":449,"Ping G440 LST head":429,"Titleist T150 heads (4-PW)":999,"TaylorMade P790 heads (4-PW)":949,"Mizuno Pro 245 heads (4-PW)":899,"Vokey SM10 head":139},
      shaft:{"Bring your own shaft":0,"Fujikura Ventus Blue":350,"Fujikura Ventus Black":350,"Graphite Design Tour AD DI":400,"Mitsubishi Tensei 1K Pro":300,"Project X HZRDUS Black":230,"KBS Tour (set)":294,"True Temper Dynamic Gold (set)":238,"Nippon Modus3 105 (set)":315},
      grip:{"Golf Pride Tour Velvet":10,"Golf Pride MCC Plus4":15,"Golf Pride CP2 Pro":13,"Lamkin Crossline":9,"SuperStroke S-Tech":14,"Bring your own grip":0},
      ferrule:{"Standard black":0,"Black w/ silver ring":4,"Custom color (tell us)":8,"Clear / no ferrule":0}};
    const labor = {driver:45,iron:120};
    function calc(){ const d=Object.fromEntries(new FormData(f).entries()); const isSet=/set|4-PW|heads/.test(d.head+d.shaft); let t=(prices.head[d.head]||0)+(prices.shaft[d.shaft]||0)+(prices.grip[d.grip]||0)*(isSet?7:1)+(prices.ferrule[d.ferrule]||0)*(isSet?7:1)+(isSet?labor.iron:labor.driver);
      $('#bs-head').textContent=d.head; $('#bs-shaft').textContent=d.shaft+' · '+d.flex; $('#bs-grip').textContent=d.grip+(d.wraps&&d.wraps!=='0'?' +'+d.wraps+' wrap':''); $('#bs-specs').textContent=`${d.length} · ${d.loft} · ${d.lie} · ${d.sw||'Std'} SW`; $('#bs-ferrule').textContent=d.ferrule; $('#bs-labor').textContent=money(isSet?labor.iron:labor.driver); $('#bs-total').textContent=money(t); }
    f.addEventListener('change',calc); f.addEventListener('input',calc); calc();
    f.addEventListener('submit',e=>{ e.preventDefault(); const d=Object.fromEntries(new FormData(f).entries()); const l=store.get('builds',[]); l.push(Object.assign({when:new Date().toISOString(),total:$('#bs-total').textContent},d)); store.set('builds',l); $('#buildwrap').innerHTML='<div class="ok" style="font-size:24px">Build request sent</div><p class="lead" style="margin-top:16px">We\'ll confirm parts, price and a build date within a day. Most builds are done in 3–5 business days once parts are in hand.</p><a class="btn" href="account.html">Account</a>'; });
  }

  /* ---------- account ---------- */
  function initAccount(){
    const root=$('#account'); if(!root) return;
    const orders=store.get('orders',[]), bookings=store.get('bookings',[]), trades=store.get('tradeins',[]), builds=store.get('builds',[]), sv=saved.list(), rc=store.get('recent',[]);
    const credit = trades.reduce((a,t)=>a+(t.credit||0),0);
    const sec=(id,title,body)=>`<section id="${id}" class="panel" style="margin-bottom:18px"><h3>${title}</h3>${body}</section>`;
    root.innerHTML = [
      sec('overview','Overview',`<div class="grid g3"><div class="stat">${money(credit)}<small>Store credit (pending trade-ins)</small></div><div class="stat">${orders.length}<small>Orders</small></div><div class="stat">${sv.length}<small>Saved clubs</small></div></div><p class="small muted" style="margin-top:14px">This is a demo account stored in your browser. At launch this connects to real customer accounts.</p>`),
      sec('orders','Orders', orders.length? `<div class="tablewrap"><table class="price"><tr><th>Order</th><th>Date</th><th>Items</th><th>Fulfilment</th><th>Total</th></tr>${orders.map(o=>`<tr><td class="mono">${o.id}</td><td>${o.when.slice(0,10)}</td><td>${o.items.map(l=>{const it=bySku(l.sku);return it?esc(it.brand+' '+it.model):l.sku;}).join(', ')}</td><td>${o.ship==='ship'?'Shipping':'<span class="tag turf">Ready for pickup</span>'}</td><td class="p">${money(o.total)}</td></tr>`).join('')}</table></div>`:'<p class="muted">No orders yet.</p>'),
      sec('saved','Saved clubs & wishlist', sv.length?`<div class="cards">${sv.map(bySku).filter(Boolean).map(card).join('')}</div>`:'<p class="muted">Tap “Save” on any club to keep an eye on it. We\'ll flag you if the price drops.</p>'),
      sec('tradeins','Trade-ins', trades.length?`<div class="tablewrap"><table class="price"><tr><th>Club</th><th>Condition</th><th>Cash</th><th>Credit</th><th>Status</th></tr>${trades.map(t=>`<tr><td>${esc(t.brand||'')} ${esc(t.model||'')}</td><td>${esc(t.cond||'')}/10</td><td>${t.cash?money(t.cash):'—'}</td><td class="p">${t.credit?money(t.credit):'—'}</td><td><span class="tag tape">${esc(t.status||'Quote requested')}</span></td></tr>`).join('')}</table></div>`:'<p class="muted">No trade-ins yet. <a href="trade-in.html">Get an estimate</a>.</p>'),
      sec('bookings','Fittings & simulator bookings', bookings.length?`<div class="tablewrap"><table class="price"><tr><th>Ref</th><th>Service</th><th>Date</th><th>Time</th></tr>${bookings.map(b=>`<tr><td class="mono">${b.id}</td><td>${esc(b.svc)}</td><td>${b.date}</td><td>${b.time}</td></tr>`).join('')}</table></div>`:'<p class="muted">Nothing booked. <a href="book.html">Book a fitting or sim time</a>.</p>'),
      sec('builds','Custom builds', builds.length?builds.map(b=>`<div class="notice turf"><b>${esc(b.head)}</b> + ${esc(b.shaft)} (${esc(b.flex)}) · ${esc(b.length)} · est. ${b.total} — <span class="tag tape">In review</span></div>`).join(''):'<p class="muted">No builds yet. <a href="custom-builds.html">Spec one out</a>.</p>'),
      sec('addresses','Saved addresses','<p class="muted">None saved. Add one at checkout.</p>'),
      sec('recent','Recently viewed', rc.length?`<div class="cards">${rc.map(bySku).filter(Boolean).slice(0,8).map(card).join('')}</div>`:'<p class="muted">Nothing yet.</p>')
    ].join('');
  }

  /* ---------- admin inventory ---------- */
  function initAdmin(){
    const t=$('#adminrows'); if(!t) return;
    function draw(){ const s=soldSet(); t.innerHTML=all().map(i=>`<tr class="adminrow ${s.has(i.sku)?'sold':''}"><td>${esc(i.sku)}</td><td>${esc(i.brand)} ${esc(i.model)} ${i.type==='used'?esc(i.club):''}</td><td>${i.type}</td><td>${i.type==='used'?i.cond+'/10':'stock '+(i.stock||1)}</td><td>${money(i.price)}</td><td>${i.arrived}</td><td><button class="btn sm ${s.has(i.sku)?'turf':''}" data-sold="${i.sku}">${s.has(i.sku)?'Relist':'Sold in store'}</button></td></tr>`).join(''); $('#admincount').textContent=`${all().length} SKUs · ${s.size} marked sold · ${live().length} live online`; }
    t.addEventListener('click',e=>{ const b=e.target.closest('[data-sold]'); if(!b) return; const s=soldSet(); s.has(b.dataset.sold)?s.delete(b.dataset.sold):s.add(b.dataset.sold); store.set('sold',[...s]); draw(); toast(s.has(b.dataset.sold)?'Marked sold — removed from the site':'Relisted'); });
    $('#adminsearch')&&$('#adminsearch').addEventListener('input',e=>{ const v=e.target.value.toLowerCase(); $$('tr',t).forEach(r=>r.style.display=r.textContent.toLowerCase().includes(v)?'':'none'); });
    draw();
  }

  /* ---------- homepage / generic blocks ---------- */
  function initBlocks(){
    const L=live();
    if($('#featured-used')) renderGrid('#featured-used', L.filter(i=>i.type==='used'&&i.featured).slice(0,8));
    if($('#new-arrivals')) renderGrid('#new-arrivals', L.filter(isNewArrival).sort((a,b)=>new Date(b.arrived)-new Date(a.arrived)).slice(0,8));
    if($('#finds')) renderGrid('#finds', L.filter(i=>i.find).slice(0,8));
    if($('#all-finds')) renderGrid('#all-finds', L.filter(i=>i.find));
    if($('#all-new')) { const grouped={}; L.filter(isNewArrival).sort((a,b)=>new Date(b.arrived)-new Date(a.arrived)).forEach(i=>{(grouped[i.arrived]=grouped[i.arrived]||[]).push(i);}); $('#all-new').innerHTML=Object.entries(grouped).map(([d,items])=>`<div class="sectionhead" style="margin-top:34px"><span class="sign">${d===D.generated?'Today':d}</span><span class="muted up">${items.length} item${items.length>1?'s':''}</span></div><div class="cards">${items.map(card).join('')}</div>`).join(''); }
    if($('#brandwall')) $('#brandwall').innerHTML=D.brands.map(b=>`<a href="${REL}shop.html?brand=${encodeURIComponent(b[0])}">${esc(b[0])}</a>`).join('');
    if($('#brandgrid')) $('#brandgrid').innerHTML=D.brands.map(b=>{ const n=L.filter(i=>i.brand===b[0]||i.shaftBrand===b[0]).length; return `<a class="svc" href="shop.html?brand=${encodeURIComponent(b[0])}"><h3>${esc(b[0])}</h3><p class="small muted">${esc(b[1])}</p><span class="from">${n?`<b>${n}</b> in stock`:'Special order'}</span></a>`; }).join('');
    if($('#brand-count')) $('#brand-count').textContent=D.brands.length;
    if($('#used-count')) $('#used-count').textContent=L.filter(i=>i.type==='used').length;
    $$('[data-jag]').forEach(el=>el.innerHTML=I.jaguar(el.dataset.jag||''));
    $$('[data-ico]').forEach(el=>el.innerHTML=I[el.dataset.ico]||'');
  }

  document.addEventListener('DOMContentLoaded',()=>{
    initHeader(); initBlocks(); initShop({}); initPDP(); initCart(); initCheckout(); initTrade(); initBooking(); initBuild(); initAccount(); initAdmin();
  });
  window.PWR = {cart, live, all, bySku, card, renderGrid, toast, store, money};
})();
