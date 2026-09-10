/* PWR Lounge — standalone engine. No dependency on the golf shop's inventory or cart. */
(function(){
  const $=(s,el=document)=>el.querySelector(s);
  const $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const store={
    get(k,d){try{const v=localStorage.getItem('lng_'+k);return v?JSON.parse(v):d;}catch(e){return d;}},
    set(k,v){try{localStorage.setItem('lng_'+k,JSON.stringify(v));}catch(e){}}
  };

  function initHeader(){
    const b=$('.burger-l'), m=$('nav.lmobile');
    if(b&&m) b.addEventListener('click',()=>m.classList.toggle('open'));
    const here=location.pathname.split('/').pop()||'index.html';
    $$('nav.lnav a').forEach(a=>{ if(a.getAttribute('href')===here) a.classList.add('on'); });
  }

  function initForms(){
    $$('form[data-lsignup]').forEach(f=>f.addEventListener('submit',e=>{
      e.preventDefault();
      const em=$('input[type=email]',f); const val=em?em.value:'';
      const l=store.get('signups',[]); l.push({email:val,when:new Date().toISOString()}); store.set('signups',l);
      f.innerHTML='<div class="lok">You\'re on the list — league nights and events first.</div>';
    }));
    $$('form[data-ldemo]').forEach(f=>f.addEventListener('submit',e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(f).entries());
      const key=f.dataset.ldemo; const l=store.get(key,[]); l.push(Object.assign({when:new Date().toISOString()},data)); store.set(key,l);
      const msg=f.dataset.ok||'Got it. We\'ll follow up shortly.';
      f.innerHTML='<div class="lok">'+esc(msg)+'</div>';
    }));
  }

  // Hours-by-phase highlighter — marks the phase block matching the current time.
  function initPhases(){
    const phases=$$('.phase'); if(!phases.length) return;
    const now=new Date(); const day=now.getDay(); const hour=now.getHours()+now.getMinutes()/60;
    // Sun opens at 12; Fri/Sat run to midnight; everyone else standard 11a windows.
    let idx=-1;
    if(day===0){ if(hour>=12&&hour<14) idx=0; else if(hour>=14&&hour<17) idx=1; else if(hour>=17&&hour<18) idx=2; else if(hour>=18) idx=3; }
    else { if(hour>=11&&hour<14) idx=0; else if(hour>=14&&hour<17) idx=1; else if(hour>=17&&hour<18) idx=2; else if(hour>=18) idx=3; }
    if(idx>=0 && phases[idx]) phases[idx].classList.add('now');
  }

  function initBaySlots(){
    const root=$('#lbooking'); if(!root) return;
    const svcSel=$('#l-svc'), dateInp=$('#l-date'), slotsBox=$('#l-slots'), infoBox=$('#l-info');
    const SVC={
      "Bay — 1 hour":{price:40,dur:60}, "Bay — 2 hours":{price:70,dur:120}, "Bay — practice (30 min)":{price:20,dur:30},
      "Club testing session (free w/ purchase)":{price:30,dur:45}, "League night sign-up":{price:0,dur:90}, "Corporate / private event inquiry":{price:0,dur:0}
    };
    if(svcSel) svcSel.innerHTML=Object.entries(SVC).map(([k])=>`<option>${k}</option>`).join('');
    const today=new Date();
    if(dateInp){ dateInp.min=today.toISOString().slice(0,10); dateInp.value=new Date(today.getTime()+864e5).toISOString().slice(0,10); }
    let chosen=null;
    function draw(){
      if(!svcSel||!dateInp||!slotsBox) return;
      const svc=SVC[svcSel.value];
      const d=new Date(dateInp.value+'T12:00'); const dow=d.getDay();
      const open = dow===0 ? 12 : 11;
      const close = (dow===5||dow===6) ? 24 : 23; // Fri/Sat to midnight
      const hrs=[]; for(let h=open; h<close; h++) hrs.push(h);
      const seed=(dateInp.value.replace(/-/g,'')*7+ (svcSel.selectedIndex||0)*3)%11;
      slotsBox.innerHTML = hrs.map((h,i)=>{
        const t=(h%12||12)+(h<12?':00 AM':':00 PM');
        const taken = ((i*5+seed)%9===0);
        return `<button type="button" ${taken?'disabled':''} data-t="${t}" class="${chosen===t?'on':''}">${t}</button>`;
      }).join('');
      if(infoBox) infoBox.innerHTML = `<b>${esc(svcSel.value)}</b> · ${svc.dur?svc.dur+' min':'—'} · ${svc.price?'$'+svc.price:'Free'}`;
    }
    slotsBox && slotsBox.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||b.disabled) return; chosen=b.dataset.t; draw(); });
    svcSel && svcSel.addEventListener('change',()=>{chosen=null;draw();});
    dateInp && dateInp.addEventListener('change',()=>{chosen=null;draw();});
    draw();
    root.addEventListener('submit',e=>{
      e.preventDefault();
      if(svcSel.value!=='Corporate / private event inquiry' && !chosen){ alert('Pick a time slot first.'); return; }
      const d=Object.fromEntries(new FormData(root).entries());
      const l=store.get('bookings',[]); const id='LNG-'+String(4000+l.length+1);
      l.push({id,svc:svcSel.value,date:dateInp.value,time:chosen,players:d.players,name:d.name,phone:d.phone,notes:d.notes,when:new Date().toISOString()});
      store.set('bookings',l);
      root.innerHTML=`<div class="lok">Booked — ${id}</div><p class="lead" style="margin-top:16px">${esc(svcSel.value)}${chosen?' on '+dateInp.value+' at '+chosen:''}. We'll text ${esc(d.phone||'you')} a reminder.</p>`;
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{ initHeader(); initForms(); initPhases(); initBaySlots(); });
})();
