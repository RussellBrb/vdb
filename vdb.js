/* ════════════════════════════════════════════════════════════════════════════
   VDB — Visual DashBoard engine  ·  v11.1 (· flow label stagger · inline **md** in note/callout · v11: flow-fix/mermaid)
     VDB('#el', { theme, title, subtitle, backdrop, decor, state, components:[...] })
   No dependencies. v3 adds interactivity, modelled on Vega-Lite's idea that
   interaction is STATE and every view is a pure function of it:
     • spec.state — named params with defaults
     • control components — tabs, toggle, slider, select, button (write params)
     • components may declare `when:'param==value'` to show/hide
     • one delegated listener · idempotent re-render · focus preserved
     • host bridge: button action {prompt} → sendPrompt; {tool,args} → cowork.callMcpTool
       {url} → openLink; degrades to console.log when no host is present
   ════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function hashStr(s){s=String(s);let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return (h^(h>>>16))>>>0;}
  function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
  const hsl=(h,s,l)=>`hsl(${((h%360)+360)%360} ${s}% ${l}%)`;
  function debounce(fn,ms){let t;return function(){clearTimeout(t);const a=arguments,c=this;t=setTimeout(()=>fn.apply(c,a),ms);};}
  function coerce(v){if(v==='true')return true;if(v==='false')return false;if(v!==''&&!isNaN(+v))return +v;return v;}
  function evalWhen(e,st){if(!e)return true;const m=String(e).match(/^\s*(\w+)\s*(==|!=|>=|<=|>|<)\s*(.+?)\s*$/);if(!m)return !!st[e];let a=st[m[1]],b=coerce(m[3].replace(/^['"]|['"]$/g,''));switch(m[2]){case'==':return a==b;case'!=':return a!=b;case'>=':return a>=b;case'<=':return a<=b;case'>':return a>b;case'<':return a<b;}return true;}

  const THEMES = {
    'twilight-forest': { bg:'linear-gradient(180deg,#2e1065,#14342e 64%,#07211a)', anchor:'#34d399', secondary:'#2dd4bf', tint:'#a7f3d0', accent:'#fbbf24', ink:'#ecfdf5', muted:'rgba(187,247,208,.7)', line:'rgba(52,211,153,.35)', sky:['#3b2f6e','#5b6f6a'], motif:'forest' },
    'under-the-sea':   { bg:'linear-gradient(180deg,#22d3ee,#0e7490 64%,#053b4a)', anchor:'#67e8f9', secondary:'#22d3ee', tint:'#cffafe', accent:'#fde68a', ink:'#ecfeff', muted:'rgba(207,250,254,.78)', line:'rgba(236,254,255,.35)', sky:['#0e7490','#22d3ee'], motif:'waves' },
    'sunrise':         { bg:'linear-gradient(180deg,#2d1b4e,#db2777 48%,#fb923c 80%,#fde68a)', anchor:'#fb7185', secondary:'#fb923c', tint:'#fde68a', accent:'#a855f7', ink:'#fff7ed', muted:'rgba(255,237,213,.82)', line:'rgba(253,186,116,.4)', sky:['#2d1b4e','#fb923c'], motif:'mountains' },
    'synthwave':       { bg:'linear-gradient(180deg,#1a0b2e,#2d0b46 60%,#3b0d52)', anchor:'#ff2e88', secondary:'#22d3ee', tint:'#f0abfc', accent:'#fbbf24', ink:'#f5d0fe', muted:'rgba(245,208,254,.7)', line:'rgba(255,46,136,.4)', sky:['#2d0b46','#ff2e88'], motif:'mountains' },
    'crt':             { bg:'radial-gradient(ellipse 90% 70% at 50% 0%,#0d1024,#040509 72%)', anchor:'#39ff14', secondary:'#00e5ff', tint:'#a5f3fc', accent:'#ff2e88', ink:'#d6ffe0', muted:'rgba(159,185,199,.8)', line:'rgba(0,229,255,.35)', sky:['#040509','#0d1024'], motif:'mountains' },
    'chill':           { bg:'linear-gradient(165deg,#272150,#3b2f55)', anchor:'#c4b5fd', secondary:'#5eead4', tint:'#e9deff', accent:'#fda4af', ink:'#f3efff', muted:'rgba(185,174,224,.85)', line:'rgba(255,255,255,.12)', sky:['#272150','#4b3f6e'], motif:'hills' },
    'blueprint':       { bg:'#0c1626', anchor:'#7dd3fc', secondary:'#5eead4', tint:'#bae6fd', accent:'#fcd34d', ink:'#e6f0fa', muted:'rgba(143,166,189,.9)', line:'#1e3a5f', sky:['#0c1626','#16324f'], motif:'mountains' },
  };
  function vibePalette(vibe){const rng=mulberry32(hashStr(vibe));const b=Math.floor(rng()*360);const sec=b+(rng()<.5?28:-34);const acc=b+165+Math.floor(rng()*50-25);return {bg:`linear-gradient(165deg,${hsl(b,55,15)},${hsl(sec,48,9)})`,anchor:hsl(b,72,56),secondary:hsl(sec,66,58),tint:hsl(b+14,82,80),accent:hsl(acc,82,64),ink:'#f8fafc',muted:'rgba(248,250,252,.66)',line:'rgba(255,255,255,.14)',sky:[hsl(b,45,16),hsl(b+14,55,40)],motif:['mountains','hills','waves'][Math.floor(rng()*3)]};}
  function resolveTheme(t){if(!t)return THEMES.blueprint;if(typeof t==='object')return t.vibe?vibePalette(t.vibe):Object.assign({},THEMES.blueprint,t);return THEMES[t]||vibePalette(t);}

  function ensureStyles(){
    if(document.getElementById('vdb-styles'))return;
    const css=`
    .vdb{position:relative;overflow:hidden;font-family:var(--vdb-font,ui-monospace,'JetBrains Mono',monospace);border-radius:13px;padding:16px 18px;max-width:620px;color:var(--ink);box-shadow:0 8px 30px rgba(0,0,0,.4),inset 0 0 50px rgba(255,255,255,.04)}
    .vdb *{box-sizing:border-box} .vdb>.vdb-body{position:relative;z-index:1} .vdb-deco{position:absolute;inset:0;z-index:0;pointer-events:none}
    .vdb-bar{display:flex;justify-content:space-between;align-items:baseline;font-size:22px;color:var(--tint);border-bottom:1px dashed var(--line);padding-bottom:6px;margin-bottom:6px}.vdb-bar b{color:var(--accent)}.vdb-bar small{font-size:14px;color:var(--muted)}
    .vdb-sub{font-size:13px;color:var(--muted);margin-bottom:12px}
    .vdb-h{font-size:13px;color:var(--secondary);letter-spacing:.06em;margin:14px 0 7px;text-transform:uppercase;opacity:.9}
    .vdb-row{margin:9px 0}.vdb-lab{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;margin-bottom:4px}.vdb-lab .c{color:var(--muted);font-size:12px}
    .vdb-trk{height:10px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}.vdb-fl{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--anchor),var(--secondary))}
    .vdb-seg{display:flex;height:22px;border-radius:6px;overflow:hidden}
    .vdb-lg{display:flex;flex-wrap:wrap;gap:11px;margin-top:8px;font-size:13px;color:var(--muted)}.vdb-lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}
    .vdb-gw{display:flex;align-items:center;gap:16px;margin:6px 0}.vdb-gc{position:relative;width:108px;height:108px;flex-shrink:0}.vdb-gt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.vdb-gv{font-size:26px;color:var(--accent)}.vdb-gl{font-size:13px;color:var(--muted)}
    .vdb-tiles{display:grid;grid-template-columns:repeat(var(--cols,4),1fr);gap:9px;text-align:center;flex:1}.vdb-tile{border:1px solid var(--line);border-radius:8px;padding:8px 4px}.vdb-tv{font-size:24px;color:var(--anchor)}.vdb-tl{font-size:13px;color:var(--muted);margin-top:2px}
    .vdb-q{font-size:15px;line-height:1.6}.vdb-pill{padding:2px 9px;border-radius:20px;font-size:13px}
    .vdb-focal{text-align:center;padding:14px 0 6px}.vdb-fv{font-size:48px;font-weight:600;line-height:1;color:var(--accent);text-shadow:0 2px 18px rgba(0,0,0,.3)}.vdb-fl2{font-size:15px;color:var(--tint);margin-top:5px}.vdb-fs{font-size:12px;color:var(--muted);margin-top:2px}
    .vdb-scene{display:block;border-radius:9px;overflow:hidden;margin:6px 0}
    .vdb-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:4px}.vdb-card{border:1px solid var(--line);border-radius:9px;padding:9px 11px}.vdb-card.rec{border:2px solid var(--accent)}.vdb-ct{font-size:14px;color:var(--ink)}.vdb-cd{font-size:12px;color:var(--muted);margin:3px 0 6px}.vdb-cg{font-size:11px;color:var(--muted)}
    .vdb-note{font-size:13.5px;color:var(--muted);line-height:1.6;margin-top:13px;border-top:1px dashed var(--line);padding-top:10px}.vdb-note b{color:var(--tint)}
    .vdb-ctrls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0}
    .vdb-tabs{display:inline-flex;gap:2px;background:rgba(255,255,255,.08);border-radius:8px;padding:3px}
    .vdb-tab{background:none;border:0;color:var(--muted);font:inherit;font-size:13px;padding:5px 12px;border-radius:6px;cursor:pointer}
    .vdb-tab[aria-selected=true]{background:var(--accent);color:#0a0a12}
    .vdb-tab:focus-visible,.vdb-sw:focus-visible,.vdb-btn:focus-visible,.vdb-field select:focus-visible,.vdb-field input:focus-visible{outline:2px solid var(--tint);outline-offset:2px}
    .vdb-sw{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:13px;color:var(--muted);background:none;border:0;cursor:pointer}
    .vdb-knob{width:34px;height:18px;border-radius:20px;background:rgba(255,255,255,.2);position:relative;transition:background .15s}
    .vdb-sw[aria-checked=true] .vdb-knob{background:var(--accent)}
    .vdb-knob::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .15s}
    .vdb-sw[aria-checked=true] .vdb-knob::after{left:18px}
    .vdb-field{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted)}
    .vdb-field select{background:rgba(0,0,0,.28);color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:4px 7px;font:inherit}
    .vdb-field input[type=range]{accent-color:var(--accent)}
    .vdb-btn{background:var(--accent);color:#0a0a12;border:0;border-radius:7px;font:inherit;font-size:13px;padding:6px 13px;cursor:pointer}
    .vdb-step{display:inline-flex;align-items:center;gap:10px;font-size:14px;color:var(--ink)}
    .vdb-step button{background:rgba(255,255,255,.08);border:1px solid var(--line);color:var(--ink);border-radius:6px;font:inherit;padding:3px 11px;cursor:pointer}
    .vdb-diagram{display:flex;flex-direction:column;gap:6px;margin:8px 0}
    .vdb-layer{border:1px solid var(--line);border-radius:9px;padding:10px 13px;background:rgba(255,255,255,.03);transition:opacity .2s,border-color .2s,box-shadow .2s}
    .vdb-layer.dim{opacity:.38}.vdb-layer.on{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent);background:rgba(255,255,255,.06)}
    .vdb-layer .ll{font-size:14px;color:var(--ink)}.vdb-layer .ls{font-size:12px;color:var(--muted);margin-top:2px}
    .vdb-callout{border-left:3px solid var(--accent);background:rgba(255,255,255,.04);border-radius:0 8px 8px 0;padding:9px 13px;margin:8px 0;font-size:13.5px;color:var(--ink);line-height:1.55}
    @keyframes vdb-grow{from{transform:scaleX(0)}}
    @keyframes vdb-pop{from{transform:scale(.85);opacity:0}}
    @keyframes vdb-in{from{transform:translateY(7px);opacity:0}}
    @keyframes vdb-travel{from{offset-distance:0}to{offset-distance:100%}}
    .vdb-anim .vdb-fl{animation:vdb-grow .55s cubic-bezier(.2,.8,.2,1) both;transform-origin:left center}
    .vdb-anim .vdb-fv{animation:vdb-pop .5s cubic-bezier(.2,.8,.2,1) both}
    .vdb-anim .vdb-layer,.vdb-anim .vdb-callout,.vdb-anim .vdb-tile,.vdb-anim .vdb-card,.vdb-anim .vdb-scene{animation:vdb-in .4s ease both}
    .vdb-travel{animation:vdb-travel 2.4s linear infinite}
    @keyframes vdb-draw{from{stroke-dashoffset:600}to{stroke-dashoffset:0}}
    .vdb-anim .vdb-edge{stroke-dasharray:600;animation:vdb-draw 1s ease forwards}
    .vdb-mermaid{margin:8px 0;font-size:13px;color:var(--muted)}.vdb-mermaid svg{max-width:100%;height:auto}
.vdb-score{font-size:12px;color:var(--accent);background:rgba(255,255,255,.06);border:1px solid var(--line);border-radius:20px;padding:2px 10px;cursor:pointer;font-family:inherit}
    .vdb-score:focus-visible{outline:2px solid var(--tint);outline-offset:2px}
    .vdb-eff{border:1px solid var(--line);border-radius:10px;padding:10px 13px;margin:6px 0 10px;background:rgba(255,255,255,.03)}
    .vdb-anim .vdb-onpart{animation:vdb-pop .45s ease both}
        .vdb-motion{margin:8px 0}
    .vdb-mctrl{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted);margin-bottom:4px}
    .vdb-mctrl button{background:rgba(255,255,255,.08);border:1px solid var(--line);color:var(--ink);border-radius:6px;font:inherit;padding:2px 9px;cursor:pointer}
    .vdb-mcap{min-width:96px}
    .vdb-mnote{font-size:12.5px;color:var(--ink);line-height:1.5;margin-top:4px;min-height:18px}
        @media (prefers-reduced-motion:reduce){.vdb *{transition:none!important;animation:none!important}}`;
    const el=document.createElement('style');el.id='vdb-styles';el.textContent=css;document.head.appendChild(el);
  }

  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const pct=v=>Math.max(0,Math.min(100,v<=1?v*100:v));
  const h=c=>c.title?`<div class="vdb-h">${esc(c.title)}</div>`:'';

  function ridgePath(rng,w,h,baseY,amp,segs){const pts=[];for(let i=0;i<=segs;i++)pts.push([(i/segs)*w,baseY-rng()*amp]);return 'M0,'+h+' L0,'+pts[0][1].toFixed(1)+' '+pts.map(p=>'L'+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+' L'+w+','+h+' Z';}
  function sceneSVG(opts,rng,pal){const w=600,h=opts.height||150;const motif=opts.motif||pal.motif||'mountains';const sky=pal.sky||['#1b2740','#3a527a'];const cfg={mountains:{segs:7,amp:h*0.55},hills:{segs:5,amp:h*0.32},waves:{segs:10,amp:h*0.16},forest:{segs:7,amp:h*0.5}}[motif]||{segs:7,amp:h*0.5};
    const ranges=[{fill:pal.secondary,op:.35,baseY:h*.55,amp:cfg.amp*.55},{fill:pal.anchor,op:.55,baseY:h*.72,amp:cfg.amp*.8},{fill:'rgba(0,0,0,.62)',op:1,baseY:h*.9,amp:cfg.amp}];
    let body=ranges.map(r=>`<path d="${ridgePath(rng,w,h,r.baseY,r.amp,cfg.segs)}" fill="${r.fill}" opacity="${r.op}"/>`).join('');
    if(opts.sun!==false){const sx=(0.2+rng()*0.5)*w;body=`<circle cx="${sx.toFixed(0)}" cy="${(h*0.3).toFixed(0)}" r="${(h*0.13).toFixed(0)}" fill="${pal.accent}" opacity=".9" style="filter:drop-shadow(0 0 12px ${pal.accent})"/>`+body;}
    if(motif==='forest'){let t='';for(let i=0;i<5;i++){const x=rng()*w,th=h*0.16+rng()*h*0.12;t+=`<polygon points="${x},${h} ${x-th*0.4},${h} ${x},${h-th} ${x+th*0.4},${h}" fill="rgba(0,0,0,.62)"/>`;}body+=t;}
    return `<svg class="vdb-scene" width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="vdbsky_${opts.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#vdbsky_${opts.id})"/>${body}</svg>`;}

  let _mmP=null;
  function loadMermaid(){ if(_mmP) return _mmP; _mmP=new Promise(function(res,rej){ if(global.mermaid){res(global.mermaid);return;} var sc=document.createElement('script'); sc.src='https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'; sc.onload=function(){ try{global.mermaid.initialize({startOnLoad:false,theme:'dark',securityLevel:'loose'});}catch(e){} res(global.mermaid); }; sc.onerror=function(){rej(new Error('mermaid load failed'));}; document.head.appendChild(sc); }); return _mmP; }
  function vdbInitMotion(id){ var root=document.getElementById(id); if(!root||root.__mo) return; root.__mo=true; var data; try{data=JSON.parse(decodeURIComponent(root.getAttribute('data-m')));}catch(e){return;} var frames=data.frames||[]; if(!frames.length) return; var i=0,timer=null; var cap=root.querySelector('.vdb-mcap'),note=root.querySelector('.vdb-mnote'),pb=root.querySelector('.vdb-mplay');
    function apply(){ var fr=frames[i]||{},set=fr.set||{},gs=root.querySelectorAll('[data-pid]'); for(var k=0;k<gs.length;k++){ var g=gs[k],pid=g.getAttribute('data-pid'),d=set[pid]||{}; g.style.transform='translate('+(d.dx||0)+'px,'+(d.dy||0)+'px)'; var on=fr.on===pid; g.style.opacity=(fr.on&&!on)?'.5':'1'; var r=g.querySelector('rect'); if(r){r.setAttribute('stroke',on?'var(--accent)':'var(--line)');r.setAttribute('stroke-width',on?'2':'1');} } if(cap)cap.textContent=(i+1)+' / '+frames.length+(fr.caption?' · '+fr.caption:''); if(note)note.innerHTML=fr.note||''; }
    function go(n){ i=((n%frames.length)+frames.length)%frames.length; apply(); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} if(pb)pb.textContent='▶'; }
    function play(){ stop(); timer=setInterval(function(){ if(!document.body.contains(root)){stop();return;} go(i+1); },1500); if(pb)pb.textContent='⏸'; }
    root.addEventListener('click',function(e){ var b=e.target.closest('[data-mo]'); if(!b) return; e.stopPropagation(); var v=b.getAttribute('data-mo'); if(v==='play'){ timer?stop():play(); } else { stop(); go(i+parseInt(v,10)); } });
    apply(); if(data.autoplay) play(); }
  var MPRESETS={
    'pen-click':{height:240,parts:[
      {id:'barrel',label:'barrel',x:250,y:52,w:60,h:154,color:'rgba(255,255,255,.05)'},
      {id:'plunger',label:'plunger',x:258,y:12,w:44,h:34,color:'rgba(125,211,252,.5)'},
      {id:'cam',label:'cam',x:266,y:64,w:28,h:28,color:'rgba(252,211,77,.7)'},
      {id:'spring',label:'',x:272,y:150,w:16,h:38,color:'rgba(255,255,255,.14)'},
      {id:'tip',label:'tip',x:276,y:196,w:8,h:22,color:'rgba(125,211,252,.8)'}],frames:[
      {caption:'retracted',on:'cam',note:'The <b>tip</b> is up — the <b>cam</b> teeth hold it.',set:{}},
      {caption:'plunger down',on:'plunger',note:'The <b>plunger</b> pushes the <b>cam</b> down.',set:{plunger:{dy:28},cam:{dy:18},tip:{dy:16}}},
      {caption:'click! locked',on:'cam',note:'The <b>cam</b> locks into the grooves — tip stays out.',set:{plunger:{dy:28},cam:{dy:14},tip:{dy:16}}},
      {caption:'extended',on:'tip',note:'Plunger returns; the <b>tip</b> stays extended.',set:{plunger:{dy:0},cam:{dy:14},tip:{dy:16}}},
      {caption:'press → retract',on:'spring',note:'Next press frees the cam; the <b>spring</b> pushes the tip up.',set:{plunger:{dy:28},cam:{dy:18},tip:{dy:0}}}]},
    'toggle':{width:220,height:88,parts:[
      {id:'track',label:'',x:60,y:34,w:100,h:26,color:'rgba(255,255,255,.12)'},
      {id:'knob',label:'',x:62,y:32,w:30,h:30,color:'var(--accent)'}],frames:[
      {caption:'off',on:'knob',note:'Knob rests left — <b>off</b>.',set:{}},
      {caption:'on',on:'knob',note:'Knob slides right — <b>on</b>.',set:{knob:{dx:68}}}]},
    'pump':function(p){var n=p&&p.strokes||3,parts=[
      {id:'cyl',label:'cylinder',x:248,y:60,w:74,h:150,color:'rgba(255,255,255,.05)'},
      {id:'rod',label:'',x:280,y:20,w:10,h:44,color:'rgba(255,255,255,.2)'},
      {id:'piston',label:'piston',x:256,y:64,w:58,h:30,color:'var(--accent)'}],frames=[];
      for(var k=0;k<n;k++){frames.push({caption:'intake '+(k+1),on:'piston',note:'Piston rises — chamber fills.',set:{}});frames.push({caption:'compress '+(k+1),on:'piston',note:'Piston drives down.',set:{piston:{dy:100},rod:{dy:100}}});}
      return {height:240,parts:parts,frames:frames};}};
  let _sid=0;
  const fmt=t=>esc(t==null?'':t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>');
  const C={
    gauge(c){const p=pct(c.value),circ=264,dash=(p/100*circ).toFixed(0);return `<div class="vdb-gw"><div class="vdb-gc"><svg width="108" height="108" viewBox="0 0 108 108"><circle cx="54" cy="54" r="42" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="9"/><circle cx="54" cy="54" r="42" fill="none" stroke="var(--anchor)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${dash} ${circ}" transform="rotate(-90 54 54)"/></svg><div class="vdb-gt"><div class="vdb-gv">${esc(c.display||(c.value<=1?c.value:Math.round(p)+'%'))}</div><div class="vdb-gl">${esc(c.label||'')}</div></div></div>${c.tiles?`<div class="vdb-tiles" style="--cols:${Math.min(c.tiles.length,2)}">${c.tiles.map(t=>`<div class="vdb-tile"><div class="vdb-tv">${esc(t.value)}</div><div class="vdb-tl">${esc(t.label)}</div></div>`).join('')}</div>`:''}</div>`;},
    bars(c){const items=c.items||[];if(!items.length)return h(c);return h(c)+items.map(it=>`<div class="vdb-row"><div class="vdb-lab"><span>${esc(it.label)}</span><span class="c">${esc(it.note!=null?it.note:Math.round(pct(it.value)))}</span></div><div class="vdb-trk"><div class="vdb-fl" style="width:${pct(it.value)}%${it.color?';background:'+it.color:''}"></div></div></div>`).join('');},
    allocation(c){const items=c.items||[];if(!items.length)return h(c);const tot=items.reduce((s,i)=>s+i.value,0)||1;const cols=['var(--anchor)','var(--secondary)','var(--tint)','var(--accent)','var(--muted)'];return h(c)+`<div class="vdb-seg">${items.map((i,k)=>`<div style="width:${(i.value/tot*100).toFixed(1)}%;background:${i.color||cols[k%cols.length]}"></div>`).join('')}</div><div class="vdb-lg">${items.map((i,k)=>`<span><i style="background:${i.color||cols[k%cols.length]}"></i>${esc(i.label)} ${Math.round(i.value/tot*100)}%</span>`).join('')}</div>`;},
    sparkline(c){const pts=c.points||[];if(!pts.length)return h(c);const n=pts.length,max=Math.max.apply(null,pts),min=Math.min.apply(null,pts);const X=i=>(i/(n-1)*240).toFixed(1),Y=v=>(60-((v-min)/((max-min)||1))*50-5).toFixed(1);return h(c)+`<svg width="100%" height="66" viewBox="0 0 240 66" preserveAspectRatio="none"><polyline points="${pts.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="var(--secondary)" stroke-width="2.5"/><circle cx="${X(n-1)}" cy="${Y(pts[n-1])}" r="3.5" fill="var(--accent)"/></svg>${c.caption?`<div class="vdb-lab"><span class="c">${esc(c.caption)}</span></div>`:''}`;},
    tiles(c){const items=c.items||[];if(!items.length)return h(c);return `<div class="vdb-tiles" style="--cols:${items.length}">${items.map(t=>`<div class="vdb-tile"><div class="vdb-tv">${esc(t.value)}</div><div class="vdb-tl">${esc(t.label)}</div></div>`).join('')}</div>`;},
    pipeline(c){const items=c.items||[];if(!items.length)return h(c);const sty={done:'background:rgba(52,211,153,.18);color:var(--anchor)',active:'background:var(--accent);color:#0a0a12',queued:'background:rgba(255,255,255,.08);color:var(--muted)'};return h(c)+`<div class="vdb-q" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${items.map((it,i)=>`${i?'<span style="color:var(--muted)">→</span>':''}<span class="vdb-pill" style="${sty[it.state]||sty.queued}">${it.state==='done'?'✓ ':it.state==='active'?'▶ ':'○ '}${esc(it.label)}</span>`).join('')}</div>`;},
    note(c){return `<div class="vdb-note">${c.html||fmt(c.text)}</div>`;},
    focal(c){return `<div class="vdb-focal"><div class="vdb-fv">${esc(c.value)}</div>${c.label?`<div class="vdb-fl2">${esc(c.label)}</div>`:''}${c.sub?`<div class="vdb-fs">${esc(c.sub)}</div>`:''}</div>`;},
    scene(c){return sceneSVG({height:c.height,motif:c.motif,sun:c.sun,id:++_sid},c._rng,c._pal);},
    comparison(c){const items=c.items||[];if(!items.length)return h(c);return h(c)+items.map(it=>`<div class="vdb-row"><div class="vdb-lab"><span>${esc(it.label)}</span><span class="c">${esc(it.aNote!=null?it.aNote:it.a)} · ${esc(it.bNote!=null?it.bNote:it.b)}</span></div><div class="vdb-trk"><div class="vdb-fl" style="width:${pct(it.a)}%"></div></div><div class="vdb-trk" style="margin-top:3px"><div class="vdb-fl" style="width:${pct(it.b)}%;background:var(--muted)"></div></div></div>`).join('');},
    cards(c){const items=c.items||[];if(!items.length)return h(c);return `<div class="vdb-cards">${items.map(it=>`<div class="vdb-card${it.rec?' rec':''}"><div class="vdb-ct">${esc(it.title)}</div>${it.desc?`<div class="vdb-cd">${esc(it.desc)}</div>`:''}${it.tag?`<div class="vdb-cg" style="${it.rec?'color:var(--accent)':''}">${esc(it.tag)}</div>`:''}</div>`).join('')}</div>`;},
    /* ── v3 controls (write spec.state) ── */
    tabs(c){const opts=c.options||[];if(!opts.length)return h(c);const st=c._state;return `<div class="vdb-tabs" role="tablist" data-focus="${esc(c.param)}">${opts.map(o=>{const v=o.value!=null?o.value:o,l=o.label!=null?o.label:o,sel=st[c.param]==v;return `<button class="vdb-tab" role="tab" aria-selected="${sel}" tabindex="${sel?0:-1}" data-vdb-tab="${esc(c.param)}" data-v="${esc(v)}" data-focus="${esc(c.param)}#${esc(v)}">${esc(l)}</button>`;}).join('')}</div>`;},
    toggle(c){const on=!!c._state[c.param];return `<button class="vdb-sw" role="switch" aria-checked="${on}" data-vdb-toggle="${esc(c.param)}" data-focus="${esc(c.param)}"><span class="vdb-knob"></span>${esc(c.label||c.param)}</button>`;},
    select(c){const opts=c.options||[];if(!opts.length)return h(c);const st=c._state;return `<label class="vdb-field">${c.label?esc(c.label):''}<select data-vdb-select="${esc(c.param)}" data-focus="${esc(c.param)}" aria-label="${esc(c.label||c.param)}">${opts.map(o=>{const v=o.value!=null?o.value:o,l=o.label!=null?o.label:o;return `<option value="${esc(v)}" ${st[c.param]==v?'selected':''}>${esc(l)}</option>`;}).join('')}</select></label>`;},
    slider(c){const v=c._state[c.param]!=null?c._state[c.param]:(c.min||0);return `<label class="vdb-field">${esc(c.label||c.param)} <input type="range" data-vdb-slider="${esc(c.param)}" data-focus="${esc(c.param)}" min="${c.min||0}" max="${c.max!=null?c.max:100}" step="${c.step||1}" value="${v}" aria-label="${esc(c.label||c.param)}"><span class="vdb-out">${esc(v)}</span></label>`;},
    button(c){return `<button class="vdb-btn" data-vdb-btn="${c._idx}" data-focus="btn${c._idx}">${esc(c.label||'Go')}</button>`;},
    stepper(c){const p=c.param,n=c.steps||1,cur=c._state[p]||1,lbl=(c.labels&&c.labels[cur-1])?c.labels[cur-1]:(cur+' / '+n);return `<div class="vdb-step" data-focus="${esc(p)}"><button data-vdb-step="-1" data-p="${esc(p)}" data-n="${n}" aria-label="previous">\u25C0</button><span class="n">${esc(lbl)}</span><button data-vdb-step="1" data-p="${esc(p)}" data-n="${n}" aria-label="next">\u25B6</button></div>`;},
    diagram(c){const cur=c.active?c._state[c.active]:null;return `<div class="vdb-diagram">${(c.layers||[]).map((L,i)=>{const on=cur!=null&&(L.step!=null?L.step:i+1)==cur;const cls=cur==null?'':(on?'on':'dim');return `<div class="vdb-layer ${cls}">${L.tag?`<span style="display:inline-block;min-width:50px;text-align:center;color:#06070f;background:${L.color||'var(--secondary)'};border-radius:4px;font-size:11px;padding:1px 6px;margin-right:8px">${esc(L.tag)}</span>`:''}<span class="ll">${esc(L.label)}</span>${L.sub?`<div class="ls">${esc(L.sub)}</div>`:''}</div>`;}).join('')}</div>`;},
    callout(c){return `<div class="vdb-callout">${c.html||fmt(c.text)}</div>`;},
    flow(c){const nodes=c.nodes||c.steps||[];const n=nodes.length||1;const w=600,H=104,y=54;const X=i=>n<2?w/2:30+i/(n-1)*(w-60);const line=`M30,${y} L${w-30},${y}`;const nm=nodes.map((nd,i)=>{const x=X(i).toFixed(1),l=(nd&&nd.label!=null)?nd.label:nd,ab=i%2===1,ly=ab?16:H-6,t1=ab?y-6:y+6,t2=ab?26:H-22;return `<line x1="${x}" y1="${t1}" x2="${x}" y2="${t2}" stroke="var(--line)" stroke-width="1" opacity=".45"/><circle cx="${x}" cy="${y}" r="6" fill="var(--anchor)"/><text x="${x}" y="${ly}" text-anchor="middle" fill="var(--muted)" font-size="11">${esc(l)}</text>`;}).join('');return h(c)+`<svg width="100%" height="${H}" viewBox="0 0 ${w} ${H}"><path d="${line}" stroke="var(--line)" stroke-width="2" fill="none"/>${nm}<circle r="4.5" fill="var(--accent)" class="vdb-travel" style="offset-path:path('${line}');filter:drop-shadow(0 0 5px var(--accent))"/></svg>`;},
    nodes(c){c._id=++_sid;const ns=c.nodes||[];const byId={};ns.forEach(function(n,i){n._i=i;if(n.id!=null)byId[n.id]=n;});const cols={};ns.forEach(function(n,i){const k=n.col!=null?n.col:i;(cols[k]=cols[k]||[]).push(n);});const ck=Object.keys(cols).map(Number).sort(function(a,b){return a-b;});const NW=120,NH=34,GX=48,GY=14,PX=8,PY=8;const maxR=Math.max.apply(null,ck.map(function(k){return cols[k].length;}));const W=PX*2+ck.length*NW+(ck.length-1)*GX;const H=PY*2+maxR*NH+(maxR-1)*GY;ck.forEach(function(k,ci){const arr=cols[k],colH=arr.length*NH+(arr.length-1)*GY,y0=(H-colH)/2;arr.forEach(function(n,ri){n._x=PX+ci*(NW+GX);n._y=y0+ri*(NH+GY);});});const cur=c.active?c._state[c.active]:null;const eg=(c.edges||[]).map(function(e){const f=Array.isArray(e)?e[0]:e.from,t=Array.isArray(e)?e[1]:e.to,a=byId[f]||ns[f],b=byId[t]||ns[t];if(!a||!b)return '';const x1=a._x+NW,y1=a._y+NH/2,x2=b._x,y2=b._y+NH/2,mx=(x1+x2)/2;return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="var(--line)" stroke-width="2" class="vdb-edge" marker-end="url(#vdbar_${c._id})"/>`;}).join('');const nm=ns.map(function(n,i){const on=cur!=null&&((n.step!=null?n.step:i+1)==cur),op=cur!=null&&!on?'.45':'1';return `<g opacity="${op}"><rect x="${n._x}" y="${n._y}" width="${NW}" height="${NH}" rx="8" fill="rgba(255,255,255,.05)" stroke="${on?'var(--accent)':'var(--line)'}" stroke-width="${on?2:1}"/><text x="${n._x+NW/2}" y="${n._y+NH/2+4}" text-anchor="middle" fill="var(--ink)" font-size="12">${esc(n.label!=null?n.label:n.id)}</text></g>`;}).join('');return h(c)+`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:${W}px"><defs><marker id="vdbar_${c._id}" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6" fill="var(--line)"/></marker></defs>${eg}${nm}</svg>`;},
    mermaid(c){const id='vdbmm_'+(++_sid);var pal=c._pal||{};setTimeout(function(){const host=document.getElementById(id);if(!host)return;const fb=function(){host.innerHTML='<pre style="white-space:pre-wrap;font-size:12px;color:var(--muted);margin:0">'+esc(c.code)+'</pre>';};loadMermaid().then(function(mm){try{mm.initialize({startOnLoad:false,securityLevel:'loose',theme:'base',themeVariables:{background:'transparent',primaryColor:pal.secondary||'#334155',primaryTextColor:'#0a0a12',nodeTextColor:'#0a0a12',textColor:pal.ink||'#fff',primaryBorderColor:pal.line||'#555',lineColor:pal.line||'#888',secondaryColor:pal.anchor||'#888',tertiaryColor:'rgba(255,255,255,.05)',fontFamily:'ui-monospace, monospace'}});mm.render(id+'_s',c.code).then(function(r){if(document.getElementById(id))host.innerHTML=r.svg;}).catch(fb);}catch(e){fb();}}).catch(fb);},0);return h(c)+`<div id="${id}" class="vdb-mermaid"${c.key?` data-vkey="${esc(c.key)}"`:''}>Loading diagram…</div>`;},
    stage(c){const parts=c.parts||[];const cur=c.active?c._state[c.active]:null;const W=600,BW=160,BH=30,GY=8,PX=18,PY=14,n=parts.length;const H=PY*2+n*BH+(Math.max(0,n-1))*GY;let bands='',anno='';parts.forEach(function(p,i){const y=PY+i*(BH+GY),on=cur!=null&&((p.step!=null?p.step:i+1)==cur),op=cur!=null&&!on?'.4':'1';bands+=`<g opacity="${op}"${on?' class="vdb-onpart"':''}${c.active?` data-vdb-set="${c.active}" data-v="${p.step!=null?p.step:i+1}" role="button" tabindex="0" style="cursor:pointer"`:''}><rect x="${PX}" y="${y}" width="${BW}" height="${BH}" rx="7" fill="${on?(p.color||'rgba(255,255,255,.09)'):'rgba(255,255,255,.04)'}" stroke="${on?'var(--accent)':'var(--line)'}" stroke-width="${on?2:1}"/><text x="${PX+BW/2}" y="${y+BH/2+4}" text-anchor="middle" fill="var(--ink)" font-size="12">${esc(p.label!=null?p.label:p.id)}</text></g>`;if(on&&p.note){const my=y+BH/2,lx=PX+BW,nx=PX+BW+44;anno=`<path d="M${lx},${my} L${lx+24},${my} L${nx},${my}" stroke="var(--accent)" stroke-width="1.5" fill="none"/><circle cx="${lx}" cy="${my}" r="2.5" fill="var(--accent)"/><foreignObject x="${nx}" y="${my-28}" width="${W-nx-10}" height="64"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px;color:var(--ink);line-height:1.45;font-family:inherit">${p.note}</div></foreignObject>`;}});return h(c)+`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:${W}px">${bands}${anno}</svg>`;},
    motion(c){if(c.preset&&MPRESETS[c.preset]){var _pp=MPRESETS[c.preset];if(typeof _pp==='function')_pp=_pp(c.params||{});c=Object.assign({},_pp,c);}const id='vdbmo_'+(++_sid);const W=c.width||600,H=c.height||200;const ps=(c.parts||[]).map(function(p){return `<g data-pid="${esc(p.id)}" style="transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .3s"><rect x="${p.x||0}" y="${p.y||0}" width="${p.w||60}" height="${p.h||24}" rx="6" fill="${p.color||'rgba(255,255,255,.08)'}" stroke="var(--line)"/>${p.label?`<text x="${(p.x||0)+(p.w||60)/2}" y="${(p.y||0)+(p.h||24)/2+4}" text-anchor="middle" fill="var(--ink)" font-size="11">${esc(p.label)}</text>`:''}</g>`;}).join('');const data=encodeURIComponent(JSON.stringify({frames:c.frames||[],autoplay:c.autoplay!==false}));setTimeout(function(){vdbInitMotion(id);},0);return h(c)+`<div id="${id}" class="vdb-motion"${c.key?` data-vkey="${esc(c.key)}"`:''} data-m="${data}"><div class="vdb-mctrl"><button data-mo="-1" aria-label="previous">◀</button><span class="vdb-mcap"></span><button data-mo="1" aria-label="next">▶</button><button data-mo="play" class="vdb-mplay" aria-label="play / pause">⏸</button></div><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:${W}px">${ps}</svg><div class="vdb-mnote"></div></div>`;},
  };

  const ATM={far:'opacity:.5;filter:saturate(.7)',mid:'opacity:.8',near:''};

  function renderComp(c,state,actions,pal,rng){
    if(c.when && !evalWhen(c.when,state)) return '';
    if(c.type==='controls') return `<div class="vdb-ctrls">${(c.items||[]).map(i=>renderComp(i,state,actions,pal,rng)).join('')}</div>`;
    if(!C[c.type]) return '';
    c._state=state; c._pal=pal; c._rng=rng;
    if(c.type==='button') c._idx=actions.push(c.action||{})-1;
    let html=C[c.type](c);
    if(c.depth && ATM[c.depth] && c.type!=='controls') html=`<div style="${ATM[c.depth]}">${html}</div>`;
    return html;
  }

  function VDB(target, spec){
    ensureStyles();
    const el = typeof target==='string' ? document.querySelector(target) : target;
    if(!el) return;
    const pal = resolveTheme(spec.theme);
    const seed = spec.seed || spec.title || JSON.stringify(spec.theme) || 'vdb';
    const state = el.__state && el.__spec===spec ? el.__state : Object.assign({}, spec.state||{});
    el.__state = state; el.__spec = spec;

    function hostAction(a){
      if(!a) return;
      if(a.prompt){ var P=String(a.prompt).replace(/\{(\w+)\}/g,function(_,k){return state[k]!=null?state[k]:'';}); if(typeof global.sendPrompt==='function') global.sendPrompt(P); else if(global.cowork&&global.cowork.sendPrompt) global.cowork.sendPrompt(P); else console.log('[vdb] prompt →',P); }
      else if(a.tool){ if(global.cowork&&global.cowork.callMcpTool){ Promise.resolve(global.cowork.callMcpTool(a.tool,a.args||{})).then(()=>render()).catch(e=>console.error('[vdb] tool error',e)); } else console.log('[vdb] tool →',a.tool,a.args||{}); }
      else if(a.url){ if(typeof global.openLink==='function') global.openLink(a.url); else global.open(a.url,'_blank','noopener'); }
    }

    function render(){
      const rng = mulberry32(hashStr(seed));   /* fresh each render → stable scene */
      const actions = []; el.__actions = actions;
      let deco='';
      if(spec.backdrop){const bo=typeof spec.backdrop==='object'?Object.assign({},spec.backdrop):{motif:spec.backdrop};bo.id=++_sid;bo.height=bo.height||220;deco+=`<div class="vdb-deco" style="opacity:${bo.opacity!=null?bo.opacity:.5}">${sceneSVG(bo,rng,pal)}</div>`;}
      (spec.decor||[]).forEach(d=>{ if(d==='vignette')deco+=`<div class="vdb-deco" style="box-shadow:inset 0 0 90px 12px rgba(0,0,0,.5)"></div>`; else if(d==='scanlines')deco+=`<div class="vdb-deco" style="background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 1px,transparent 2px 4px)"></div>`; else if(d==='mist')deco+=`<div class="vdb-deco" style="background:linear-gradient(0deg,rgba(255,255,255,.10),transparent 35%)"></div>`; });
      const _sc=spec.score; const _chip=_sc?`<button class="vdb-score" data-vdb-score aria-expanded="${!!state.__eff}">${esc(_sc.label||'score')} · ${esc(_sc.grade!=null?_sc.grade:_sc.value)}</button>`:'';
      const head=(spec.title||spec.subtitle||_sc)?`<div class="vdb-bar"><span>${spec.title||''}</span><span style="display:flex;gap:8px;align-items:baseline">${spec.tag?`<small>${esc(spec.tag)}</small>`:''}${_chip}</span></div>${spec.subtitle?`<div class="vdb-sub">${esc(spec.subtitle)}</div>`:''}`:'';
      const effP=(_sc&&state.__eff&&_sc.detail)?`<div class="vdb-eff"><div class="vdb-h">Efficiency</div>${_sc.detail.map(function(d){var v=Math.max(0,Math.min(100,d.value<=1?d.value*100:d.value));return `<div class="vdb-row"><div class="vdb-lab"><span>${esc(d.label)}</span><span class="c">${esc(d.note!=null?d.note:Math.round(v))}</span></div><div class="vdb-trk"><div class="vdb-fl" style="width:${v}%"></div></div></div>`;}).join('')}</div>`:'';
      const body=(spec.components||[]).map(c=>renderComp(c,state,actions,pal,rng)).join('');
      /* preserve focus across re-render */
      const a=document.activeElement, fk=a&&el.contains(a)?a.getAttribute('data-focus'):null;
      const _keep={};var _lv=el.querySelectorAll('[data-vkey]');for(var _q=0;_q<_lv.length;_q++)_keep[_lv[_q].getAttribute('data-vkey')]=_lv[_q];
      el.innerHTML=deco+`<div class="vdb-body">${head}${effP}${body}</div>`;
      Object.keys(_keep).forEach(function(k){var fr=el.querySelector('[data-vkey="'+(window.CSS&&CSS.escape?CSS.escape(k):k)+'"]');if(fr&&fr!==_keep[k])fr.replaceWith(_keep[k]);});
      if(fk){const t=el.querySelector('[data-focus="'+(window.CSS&&CSS.escape?CSS.escape(fk):fk)+'"]'); if(t&&t.focus)t.focus();}
    }

    el.className='vdb'+(spec.animate?' vdb-anim':'');
    el.style.cssText=`background:${pal.bg};border:1px solid ${pal.accent};--anchor:${pal.anchor};--secondary:${pal.secondary};--tint:${pal.tint};--accent:${pal.accent};--ink:${pal.ink};--muted:${pal.muted};--line:${pal.line};`+(spec.font?`--vdb-font:${spec.font};`:'');

    if(!el.__bound){
      el.__bound=true;
      el.addEventListener('click',e=>{
        const tab=e.target.closest('[data-vdb-tab]'); if(tab){state[tab.dataset.vdbTab]=coerce(tab.dataset.v);render();return;}
        const tg=e.target.closest('[data-vdb-toggle]'); if(tg){state[tg.dataset.vdbToggle]=!state[tg.dataset.vdbToggle];render();return;}
        const sef=e.target.closest('[data-vdb-score]'); if(sef){state.__eff=!state.__eff;render();return;}
        const bt=e.target.closest('[data-vdb-btn]'); if(bt){hostAction((el.__actions||[])[+bt.dataset.vdbBtn]);return;}
        const stp=e.target.closest('[data-vdb-step]'); if(stp){const sp=stp.dataset.p,nn=+stp.dataset.n;state[sp]=Math.max(1,Math.min(nn,(state[sp]||1)+(+stp.dataset.vdbStep)));render();return;}
        const sset=e.target.closest('[data-vdb-set]'); if(sset){state[sset.dataset.vdbSet]=coerce(sset.dataset.v);render();return;}
      });
      el.addEventListener('keydown',e=>{
        const setk=e.target.closest('[data-vdb-set]'); if(setk&&(e.key==='Enter'||e.key===' ')){e.preventDefault();state[setk.dataset.vdbSet]=coerce(setk.dataset.v);render();return;}
        const tab=e.target.closest('[role=tab]'); if(!tab||(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'))return;
        const tabs=[...tab.parentNode.querySelectorAll('[role=tab]')],i=tabs.indexOf(tab),n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
        e.preventDefault(); n.click(); n.focus();
      });
      el.addEventListener('change',e=>{ const s=e.target.closest('[data-vdb-select]'); if(s){state[s.dataset.vdbSelect]=coerce(s.value);render();} const sl=e.target.closest('[data-vdb-slider]'); if(sl){state[sl.dataset.vdbSlider]=+sl.value;render();} });
      el.addEventListener('input',e=>{ const sl=e.target.closest('[data-vdb-slider]'); if(sl){const o=sl.parentNode.querySelector('.vdb-out'); if(o)o.textContent=sl.value;} });
    }

    el.__render=render;
    render();
    return el;
  }

  VDB.version='v11.1';
  VDB.themes=Object.keys(THEMES);
  VDB.palette=resolveTheme;
  global.VDB=VDB;
})(typeof window!=='undefined'?window:this);
