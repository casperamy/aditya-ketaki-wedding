(() => {
 'use strict';
 const $=s=>document.querySelector(s);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const site=$('#wedding-site'),gate=$('#gate-form'),guest=$('#guest-name');
 const normalized=s=>s.trim().toLocaleLowerCase().replace(/\s+/g,' ');
 // Frontend preview fixture only. Replace with server-verified invitations before launch.
 const invitations=[{name:'Aarya Harkare',first:'Aarya',matches:['aarya','aarya harkare']}];
 try{guest.value=sessionStorage.getItem('wedding-preview-name')||'';}catch{}
 gate.addEventListener('submit',e=>{
  e.preventDefault();
  const match=invitations.find(i=>i.matches.includes(normalized(guest.value)));
  if(!match){$('#gate-error').textContent='We couldn’t find that invitation. For this preview, please enter Aarya.';guest.setAttribute('aria-invalid','true');guest.focus();return;}
  guest.removeAttribute('aria-invalid');$('#gate-error').textContent='';
  try{sessionStorage.setItem('wedding-preview-name',match.first);}catch{}
  $('#personal-welcome').textContent=`DEAR ${match.first.toLocaleUpperCase()}`;
  $('#rsvp-name').value=match.name;
  site.hidden=false;gate.hidden=true;$('#gate-continue').hidden=false;
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('.enter-view').forEach(el=>observer.observe(el));
  requestAnimationFrame(()=>{$('#invitation').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});$('#welcome-heading').focus({preventScroll:true});});
 });
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.08});
 $('#change-invitation').addEventListener('click',()=>{
  site.hidden=true;gate.hidden=false;$('#gate-continue').hidden=true;
  $('#rsvp-form').reset();$('#rsvp-form').hidden=false;$('#rsvp-success').hidden=true;
  $('#reminder-form').reset();$('#reminder-form').hidden=false;$('#reminder-success').hidden=true;
  guest.value='';try{sessionStorage.removeItem('wedding-preview-name');}catch{}
  window.scrollTo({top:Math.max(0,$('#journey').offsetHeight-innerHeight),behavior:'instant'});guest.focus({preventScroll:true});
 });
 function countdown(){
  const diff=Math.max(0,new Date('2026-12-27T10:00:00-08:00')-Date.now());
  $('#count-days').textContent=String(Math.floor(diff/86400000));
  $('#count-hours').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');
  $('#count-minutes').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');
 }
 countdown();setInterval(countdown,60000);
 $('#rsvp-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget);
  const yes=data.get('attendance')==='yes';
  $('#rsvp-summary').textContent=`${data.get('name').trim()} — ${yes?'joyfully accepts. We can’t wait to celebrate together!':'regretfully declines. Sending love from afar.'}`;
  e.currentTarget.hidden=true;$('#rsvp-success').hidden=false;$('#edit-response').focus({preventScroll:true});
 });
 $('#edit-response').addEventListener('click',()=>{$('#rsvp-success').hidden=true;$('#rsvp-form').hidden=false;$('#rsvp-name').focus({preventScroll:true});});
 const dialog=$('#reminder-dialog');
 $('#open-reminder').addEventListener('click',()=>dialog.showModal());
 $('#close-reminder').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 $('#reminder-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget);
  $('#reminder-summary').textContent=`Preview: a reminder for ${data.get('email')} ${data.get('timing')} before the wedding.`;
  e.currentTarget.hidden=true;$('#reminder-success').hidden=false;
  $('#reminder-success a').focus({preventScroll:true});
 });
})();
