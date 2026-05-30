/* ════════════════════════════════════════════════════════════════════════════
   VDB — Visual DashBoard engine  ·  v1
   Render a themed dashboard from a compact spec:
     VDB('#el', { theme, title, subtitle, decor, components:[...] })
   No dependencies. Themes are named or generated from a "vibe" string
   (deterministic: same vibe → same palette). Host once, drive with tiny specs.
   ════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── deterministic randomness ──────────────────────────────────────────── */
  function hashStr(s) {
    s = String(s); let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return (h ^ (h >>> 16)) >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

  /* ── palettes ───────────────────────────────────────────────────────────── */
  /* role keys: bg, shade, anchor, secondary, tint, accent, ink, muted, line */
  const THEMES = {
    'twilight-forest': { bg:'linear-gradient(180deg,#2e1065,#14342e 64%,#07211a)', anchor:'#34d399', secondary:'#2dd4bf', tint:'#a7f3d0', accent:'#fbbf24', ink:'#ecfdf5', muted:'rgba(187,247,208,.7)', line:'rgba(52,211,153,.35)', decor:['fireflies'] },
    'under-the-sea':   { bg:'linear-gradient(180deg,#22d3ee,#0e7490 64%,#053b4a)', anchor:'#67e8f9', secondary:'#22d3ee', tint:'#cffafe', accent:'#fde68a', ink:'#ecfeff', muted:'rgba(207,250,254,.78)', line:'rgba(236,254,255,.35)', decor:['bubbles'] },
    'sunrise':         { bg:'linear-gradient(180deg,#2d1b4e,#db2777 48%,#fb923c 80%,#fde68a)', anchor:'#fb7185', secondary:'#fb923c', tint:'#fde68a', accent:'#a855f7', ink:'#fff7ed', muted:'rgba(255,237,213,.82)', line:'rgba(253,186,116,.4)' },
    'synthwave':       { bg:'linear-gradient(180deg,#1a0b2e,#2d0b46 60%,#3b0d52)', anchor:'#ff2e88', secondary:'#22d3ee', tint:'#f0abfc', accent:'#fbbf24', ink:'#f5d0fe', muted:'rgba(245,208,254,.7)', line:'rgba(255,46,136,.4)', decor:['grid'] },
    'crt':             { bg:'radial-gradient(ellipse 90% 70% at 50% 0%,#0d1024,#040509 72%)', anchor:'#39ff14', secondary:'#00e5ff', tint:'#a5f3fc', accent:'#ff2e88', ink:'#d6ffe0', muted:'rgba(159,185,199,.8)', line:'rgba(0,229,255,.35)', decor:['scanlines'] },
    'chill':           { bg:'linear-gradient(165deg,#272150,#3b2f55)', anchor:'#c4b5fd', secondary:'#5eead4', tint:'#e9deff', accent:'#fda4af', ink:'#f3efff', muted:'rgba(185,174,224,.85)', line:'rgba(255,255,255,.12)' },
    'blueprint':       { bg:'#0c1626', anchor:'#7dd3fc', secondary:'#5eead4', tint:'#bae6fd', accent:'#fcd34d', ink:'#e6f0fa', muted:'rgba(143,166,189,.9)', line:'#1e3a5f' },
  };

  function vibePalette(vibe) {
    const rng = mulberry32(hashStr(vibe));
    const base = Math.floor(rng() * 360);
    const sec = base + (rng() < 0.5 ? 28 : -34);
    const acc = base + 165 + Math.floor(rng() * 50 - 25);
    return {
      bg: `linear-gradient(165deg, ${hsl(base,55,15)}, ${hsl(sec,48,9)})`,
      anchor: hsl(base, 72, 56), secondary: hsl(sec, 66, 58),
      tint: hsl(base + 14, 82, 80), accent: hsl(acc, 82, 64),
      ink: '#f8fafc', muted: 'rgba(248,250,252,.66)', line: 'rgba(255,255,255,.14)',
      decor: [],
    };
  }
  function resolveTheme(theme) {
    if (!theme) return THEMES['blueprint'];
    if (typeof theme === 'object') return theme.vibe ? vibePalette(theme.vibe) : Object.assign({}, THEMES.blueprint, theme);
    return THEMES[theme] || vibePalette(theme);   /* unknown string → treat as a vibe */
  }

  /* ── one-time stylesheet (uses CSS vars set per instance) ───────────────── */
  function ensureStyles() {
    if (document.getElementById('vdb-styles')) return;
    const css = `
    .vdb{position:relative;overflow:hidden;font-family:var(--vdb-font,ui-monospace,'JetBrains Mono',monospace);
      border-radius:13px;padding:16px 18px;max-width:620px;color:var(--ink);
      box-shadow:0 8px 30px rgba(0,0,0,.4),inset 0 0 50px rgba(255,255,255,.04)}
    .vdb *{box-sizing:border-box}
    .vdb-deco{position:absolute;inset:0;z-index:0;pointer-events:none}
    .vdb>.vdb-body{position:relative;z-index:1}
    .vdb-bar{display:flex;justify-content:space-between;align-items:baseline;font-size:22px;
      color:var(--tint);border-bottom:1px dashed var(--line);padding-bottom:6px;margin-bottom:6px}
    .vdb-bar b{color:var(--accent)} .vdb-bar small{font-size:14px;color:var(--muted)}
    .vdb-sub{font-size:13px;color:var(--muted);margin-bottom:12px}
    .vdb-h{font-size:13px;color:var(--secondary);letter-spacing:.06em;margin:14px 0 7px;text-transform:uppercase;opacity:.9}
    .vdb-row{margin:9px 0}
    .vdb-lab{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;margin-bottom:4px}
    .vdb-lab .c{color:var(--muted);font-size:12px}
    .vdb-trk{height:10px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}
    .vdb-fl{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--anchor),var(--secondary))}
    .vdb-seg{display:flex;height:22px;border-radius:6px;overflow:hidden}
    .vdb-lg{display:flex;flex-wrap:wrap;gap:11px;margin-top:8px;font-size:13px;color:var(--muted)}
    .vdb-lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}
    .vdb-gw{display:flex;align-items:center;gap:16px;margin:6px 0}
    .vdb-gc{position:relative;width:108px;height:108px;flex-shrink:0}
    .vdb-gt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .vdb-gv{font-size:26px;color:var(--accent)} .vdb-gl{font-size:13px;color:var(--muted)}
    .vdb-tiles{display:grid;grid-template-columns:repeat(var(--cols,4),1fr);gap:9px;text-align:center;flex:1}
    .vdb-tile{border:1px solid var(--line);border-radius:8px;padding:8px 4px}
    .vdb-tv{font-size:24px;color:var(--anchor)} .vdb-tl{font-size:13px;color:var(--muted);margin-top:2px}
    .vdb-q{font-size:15px;line-height:1.6}
    .vdb-pill{padding:2px 9px;border-radius:20px;font-size:13px}
    .vdb-note{font-size:13.5px;color:var(--muted);line-height:1.6;margin-top:13px;border-top:1px dashed var(--line);padding-top:10px}
    .vdb-note b{color:var(--tint)}
    @keyframes vdb-bk{50%{opacity:0}} .vdb-bk{animation:vdb-bk 1s steps(2) infinite}`;
    const el = document.createElement('style'); el.id = 'vdb-styles'; el.textContent = css;
    document.head.appendChild(el);
  }

  /* ── component renderers (return HTML strings) ──────────────────────────── */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const pct = v => Math.max(0, Math.min(100, v <= 1 ? v * 100 : v));

  const C = {
    gauge(c) {
      const p = pct(c.value), circ = 264, dash = (p / 100 * circ).toFixed(0);
      return `<div class="vdb-gw"><div class="vdb-gc">
        <svg width="108" height="108" viewBox="0 0 108 108">
          <circle cx="54" cy="54" r="42" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="9"/>
          <circle cx="54" cy="54" r="42" fill="none" stroke="var(--anchor)" stroke-width="9" stroke-linecap="round"
            stroke-dasharray="${dash} ${circ}" transform="rotate(-90 54 54)"/></svg>
        <div class="vdb-gt"><div class="vdb-gv">${esc(c.display || (c.value <= 1 ? c.value : Math.round(p) + '%'))}</div>
        <div class="vdb-gl">${esc(c.label || '')}</div></div></div>
        ${c.tiles ? `<div class="vdb-tiles" style="--cols:${Math.min(c.tiles.length,2)}">${c.tiles.map(t=>`<div class="vdb-tile"><div class="vdb-tv">${esc(t.value)}</div><div class="vdb-tl">${esc(t.label)}</div></div>`).join('')}</div>` : ''}</div>`;
    },
    bars(c) {
      return (c.title ? `<div class="vdb-h">${esc(c.title)}</div>` : '') + c.items.map(it => `
        <div class="vdb-row"><div class="vdb-lab"><span>${esc(it.label)}</span><span class="c">${esc(it.note != null ? it.note : Math.round(pct(it.value)))}</span></div>
        <div class="vdb-trk"><div class="vdb-fl" style="width:${pct(it.value)}%${it.color ? ';background:'+it.color : ''}"></div></div></div>`).join('');
    },
    allocation(c) {
      const total = c.items.reduce((s, i) => s + i.value, 0) || 1;
      const cols = ['var(--anchor)', 'var(--secondary)', 'var(--tint)', 'var(--accent)', 'var(--muted)'];
      return (c.title ? `<div class="vdb-h">${esc(c.title)}</div>` : '') +
        `<div class="vdb-seg">${c.items.map((i, k) => `<div style="width:${(i.value/total*100).toFixed(1)}%;background:${i.color||cols[k%cols.length]}"></div>`).join('')}</div>
        <div class="vdb-lg">${c.items.map((i, k) => `<span><i style="background:${i.color||cols[k%cols.length]}"></i>${esc(i.label)} ${Math.round(i.value/total*100)}%</span>`).join('')}</div>`;
    },
    sparkline(c) {
      const pts = c.points, n = pts.length, max = Math.max.apply(null, pts), min = Math.min.apply(null, pts);
      const X = i => (i / (n - 1) * 240).toFixed(1), Y = v => (60 - ((v - min) / ((max - min) || 1)) * 50 - 5).toFixed(1);
      const line = pts.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
      return (c.title ? `<div class="vdb-h">${esc(c.title)}</div>` : '') +
        `<svg width="100%" height="66" viewBox="0 0 240 66" preserveAspectRatio="none">
          <polyline points="${line}" fill="none" stroke="var(--secondary)" stroke-width="2.5"/>
          <circle cx="${X(n-1)}" cy="${Y(pts[n-1])}" r="3.5" fill="var(--accent)"/></svg>
        ${c.caption ? `<div class="vdb-lab"><span class="c">${esc(c.caption)}</span></div>` : ''}`;
    },
    tiles(c) {
      return `<div class="vdb-tiles" style="--cols:${c.items.length}">${c.items.map(t => `<div class="vdb-tile"><div class="vdb-tv">${esc(t.value)}</div><div class="vdb-tl">${esc(t.label)}</div></div>`).join('')}</div>`;
    },
    pipeline(c) {
      const sty = { done:'background:rgba(52,211,153,.18);color:var(--anchor)', active:'background:var(--accent);color:#0a0a12', queued:'background:rgba(255,255,255,.08);color:var(--muted)' };
      return (c.title ? `<div class="vdb-h">${esc(c.title)}</div>` : '') +
        `<div class="vdb-q" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${c.items.map((it, i) =>
          `${i ? '<span style="color:var(--muted)">→</span>' : ''}<span class="vdb-pill" style="${sty[it.state]||sty.queued}">${it.state==='done'?'✓ ':it.state==='active'?'▶ ':'○ '}${esc(it.label)}</span>`).join('')}</div>`;
    },
    note(c) { return `<div class="vdb-note">${c.html || esc(c.text)}</div>`; },
  };

  /* ── decorations (seeded) ───────────────────────────────────────────────── */
  function decoHTML(kind, rng) {
    if (kind === 'scanlines' || kind === 'grid')
      return `<div class="vdb-deco" style="background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 1px,transparent 2px 4px)"></div>`;
    if (kind === 'fireflies' || kind === 'bubbles' || kind === 'stars') {
      let dots = '';
      const col = kind === 'stars' ? 'var(--tint)' : 'var(--accent)';
      for (let i = 0; i < 8; i++) dots += `<circle cx="${(rng()*100).toFixed(1)}%" cy="${(rng()*70).toFixed(1)}%" r="${(1+rng()*1.6).toFixed(1)}" fill="${col}" opacity="${(0.3+rng()*0.5).toFixed(2)}"/>`;
      return `<svg class="vdb-deco">${dots}</svg>`;
    }
    return '';
  }

  /* ── main ───────────────────────────────────────────────────────────────── */
  function VDB(target, spec) {
    ensureStyles();
    const elx = typeof target === 'string' ? document.querySelector(target) : target;
    if (!elx) return;
    const pal = resolveTheme(spec.theme);
    const rng = mulberry32(hashStr(spec.seed || spec.title || JSON.stringify(spec.theme) || 'vdb'));
    const decor = spec.decor || pal.decor || [];

    elx.className = 'vdb';
    elx.style.cssText = `background:${pal.bg};border:1px solid ${pal.accent};` +
      `--anchor:${pal.anchor};--secondary:${pal.secondary};--tint:${pal.tint};--accent:${pal.accent};--ink:${pal.ink};--muted:${pal.muted};--line:${pal.line};` +
      (spec.font ? `--vdb-font:${spec.font};` : '');

    const deco = decor.map(d => decoHTML(d, rng)).join('');
    const head = (spec.title || spec.subtitle) ? `<div class="vdb-bar"><span>${spec.title || ''}</span>${spec.tag ? `<small>${esc(spec.tag)}</small>` : ''}</div>${spec.subtitle ? `<div class="vdb-sub">${esc(spec.subtitle)}</div>` : ''}` : '';
    const body = (spec.components || []).map(c => (C[c.type] ? C[c.type](c) : '')).join('');
    elx.innerHTML = deco + `<div class="vdb-body">${head}${body}</div>`;
    return elx;
  }

  VDB.themes = Object.keys(THEMES);
  VDB.palette = resolveTheme;
  global.VDB = VDB;
})(window);
