/* ==========================================================================
   Devntric Spinner — script.js
   Fully vanilla JS. No frameworks, no build step.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Config you'll want to edit once real assets are ready
     --------------------------------------------------------------------- */
  const CONFIG = {
    companyUrl: 'https://www.devntric.com/',
    linkedInUrl: 'https://www.linkedin.com/in/ahnaf-mohsin-b630bb2b3',
    storageKey: 'devntric-spinner-state-v1',
  };

  document.getElementById('brandLink').href = CONFIG.companyUrl;
  document.getElementById('linkedinCreditLink').href = CONFIG.linkedInUrl;
  document.getElementById('linkedinIconLink').href = CONFIG.linkedInUrl;

  /* ---------------------------------------------------------------------
     Icon library — simple stroke icons drawn on canvas (per-segment)
     and as inline SVG (in the item list)
     --------------------------------------------------------------------- */
  const ICONS = {
    phone: {
      svg: '<rect x="7" y="2" width="10" height="20" rx="2"></rect><line x1="11" y1="18" x2="13" y2="18"></line>',
      draw(ctx, s){ // s = icon scale (half-size)
        ctx.beginPath();
        roundRect(ctx, -s*0.35, -s, s*0.7, s*2, s*0.18);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s*0.12, s*0.72); ctx.lineTo(s*0.12, s*0.72);
        ctx.stroke();
      }
    },
    headphones: {
      svg: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
      draw(ctx, s){
        ctx.beginPath();
        ctx.arc(0, 0, s, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        roundRect(ctx, -s, 0, s*0.42, s*0.85, s*0.14); ctx.stroke();
        ctx.beginPath();
        roundRect(ctx, s*0.58, 0, s*0.42, s*0.85, s*0.14); ctx.stroke();
      }
    },
    card: {
      svg: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>',
      draw(ctx, s){
        ctx.beginPath();
        roundRect(ctx, -s, -s*0.65, s*2, s*1.3, s*0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s, -s*0.1); ctx.lineTo(s, -s*0.1);
        ctx.stroke();
      }
    },
    hoodie: {
      svg: '<path d="M6 3l-3 5 3 2v11h12V10l3-2-3-5-4 2h-4z"></path>',
      draw(ctx, s){
        ctx.beginPath();
        ctx.moveTo(-s*0.55, -s*0.9);
        ctx.lineTo(-s, -s*0.15);
        ctx.lineTo(-s*0.62, s*0.05);
        ctx.lineTo(-s*0.62, s);
        ctx.lineTo(s*0.62, s);
        ctx.lineTo(s*0.62, s*0.05);
        ctx.lineTo(s, -s*0.15);
        ctx.lineTo(s*0.55, -s*0.9);
        ctx.quadraticCurveTo(0, -s*0.55, -s*0.55, -s*0.9);
        ctx.closePath();
        ctx.stroke();
      }
    },
    sticker: {
      svg: '<circle cx="9" cy="9" r="7"></circle><circle cx="16" cy="16" r="4"></circle>',
      draw(ctx, s){
        ctx.beginPath(); ctx.arc(-s*0.15, -s*0.15, s*0.62, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(-s*0.35,-s*0.3, s*0.07, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(s*0.05,-s*0.3, s*0.07, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(-s*0.15,-s*0.1, s*0.28, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
      }
    },
    refresh: {
      svg: '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.5 15a9 9 0 1 0 2-9.5L1 10"></path>',
      draw(ctx, s){
        ctx.beginPath();
        ctx.arc(0, 0, s*0.75, -Math.PI*0.15, Math.PI*1.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s*0.75, -s*0.05);
        ctx.lineTo(s*0.95, s*0.35);
        ctx.lineTo(s*0.42, s*0.35);
        ctx.closePath();
        ctx.stroke();
      }
    },
    gift: {
      svg: '<rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M12 8v13M3 12h18M12 8c-2-4-7-3-7 0s5 4 7 0zm0 0c2-4 7-3 7 0s-5 4-7 0z"></path>',
      draw(ctx, s){
        ctx.beginPath(); roundRect(ctx, -s*0.85, -s*0.35, s*1.7, s*1.3, s*0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(0, s*0.95); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s*0.85, s*0.1); ctx.lineTo(s*0.85, s*0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(-s*0.3,-s*0.4, s*0.28, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(s*0.3,-s*0.4, s*0.28, 0, Math.PI*2); ctx.stroke();
      }
    },
    star: {
      svg: '<polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 16.5 5.5 21 7.5 13.5 2 9 9 9"></polygon>',
      draw(ctx, s){
        ctx.beginPath();
        for(let i=0;i<5;i++){
          const a = -Math.PI/2 + i*(2*Math.PI/5);
          const a2 = a + Math.PI/5;
          const x1=Math.cos(a)*s, y1=Math.sin(a)*s;
          const x2=Math.cos(a2)*s*0.42, y2=Math.sin(a2)*s*0.42;
          if(i===0) ctx.moveTo(x1,y1); else ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  function roundRect(ctx, x, y, w, h, r){
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
  }

  const PALETTE = [
  '#9B87F5', // Purple
  '#82B5FF', // Blue
  '#7FE7E8', // Cyan
  '#A7E07A', // Green
  '#FFC46B', // Orange
  '#FF98C3'  // Pink
];

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */
 const defaultItems = [
  { id: uid(), name: 'iPhone 15',      color: '#9B87F5', icon: 'phone' },
  { id: uid(), name: 'AirPods Pro',    color: '#82B5FF', icon: 'headphones' },
  { id: uid(), name: 'Gift Card $50',  color: '#7FE7E8', icon: 'card' },
  { id: uid(), name: 'Premium Hoodie', color: '#A7E07A', icon: 'hoodie' },
  { id: uid(), name: 'Sticker Pack',   color: '#FFC46B', icon: 'sticker' },
  { id: uid(), name: 'Try Again',      color: '#FF98C3', icon: 'refresh' }
];

  let state = {
    items: loadItems() || defaultItems,
    duration: 5,
    mode: 'normal',
    sound: true,
    confetti: true,
    theme: 'violet',
    isDark: false,
    rotation: 0,
    spinning: false,
    announceDelay: 250,
    allowRepeatWinners: true,
    removeAfterWin: false,
  };

  function uid(){ return Math.random().toString(36).slice(2, 10); }
  function loadItems(){
    try{
      const raw = localStorage.getItem(CONFIG.storageKey);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) && parsed.items.length ? parsed.items : null;
    } catch(e){ return null; }
  }
  function persist(){
    try{
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({ items: state.items }));
    } catch(e){ /* storage unavailable, fail silently */ }
  }

  /* ---------------------------------------------------------------------
     DOM references
     --------------------------------------------------------------------- */
  const itemListEl = document.getElementById('itemList');
  const itemCountEl = document.getElementById('itemCount');
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const wheelWrap = document.querySelector('.wheel-wrap');
  const spinBtn = document.getElementById('spinBtn');
  const resultCard = document.getElementById('resultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultSub = document.getElementById('resultSub');

  /* ---------------------------------------------------------------------
     Dark mode (controlled from the settings modal only — the header's
     standalone theme/help buttons were removed)
     --------------------------------------------------------------------- */
  function setDarkMode(isDark){
    state.isDark = isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    syncModalControls();
  }

  /* ---------------------------------------------------------------------
     App settings modal (header gear icon) — this is the single source
     of truth for all spin/appearance settings now that the sidebar
     settings panel has been removed.
     --------------------------------------------------------------------- */
  const appSettingsModal = document.getElementById('appSettingsModal');
  const modalThemeToggle = document.getElementById('modalThemeToggle');
  const modalSoundToggle = document.getElementById('modalSoundToggle');
  const modalConfettiToggle = document.getElementById('modalConfettiToggle');
  const modalDurationGroup = document.getElementById('modalDurationGroup');
  const modalModeGroup = document.getElementById('modalModeGroup');
  const modalThemeSwatches = document.getElementById('modalThemeSwatches');

  function syncModalControls(){
    modalThemeToggle.classList.toggle('is-on', state.isDark);
    modalThemeToggle.setAttribute('aria-checked', String(state.isDark));
    modalSoundToggle.classList.toggle('is-on', state.sound);
    modalSoundToggle.setAttribute('aria-checked', String(state.sound));
    modalConfettiToggle.classList.toggle('is-on', state.confetti);
    modalConfettiToggle.setAttribute('aria-checked', String(state.confetti));
    modalDurationGroup.querySelectorAll('.pill-option').forEach(b => {
      b.classList.toggle('is-active', parseInt(b.dataset.value, 10) === state.duration);
    });
    modalModeGroup.querySelectorAll('.segmented-option').forEach(b => {
      b.classList.toggle('is-active', b.dataset.value === state.mode);
    });
  }

  document.getElementById('settingsBtn').addEventListener('click', () => {
    syncModalControls();
    appSettingsModal.removeAttribute('hidden');
  });
  document.getElementById('closeAppSettings').addEventListener('click', () => appSettingsModal.setAttribute('hidden',''));
  appSettingsModal.addEventListener('click', (e) => { if(e.target === appSettingsModal) appSettingsModal.setAttribute('hidden',''); });

  modalThemeToggle.addEventListener('click', () => setDarkMode(!state.isDark));

  function wireModalSwitch(el, key){
    el.addEventListener('click', () => {
      state[key] = !state[key];
      el.classList.toggle('is-on', state[key]);
      el.setAttribute('aria-checked', String(state[key]));
    });
  }
  wireModalSwitch(modalSoundToggle, 'sound');
  wireModalSwitch(modalConfettiToggle, 'confetti');

  modalDurationGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-option');
    if(!btn) return;
    modalDurationGroup.querySelectorAll('.pill-option').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.duration = parseInt(btn.dataset.value, 10);
  });

  /* ---------------------------------------------------------------------
     Mode-specific slogan under the header
     --------------------------------------------------------------------- */
  const SLOGANS = {
    normal:      'ONE SPIN. ONE WIN.',
    elimination: 'SPIN TO SURVIVE. LAST ONE WINS.',
  };
  const taglineEl = document.getElementById('tagline');
  function updateTagline(){
    taglineEl.style.opacity = '0';
    setTimeout(() => {
      taglineEl.textContent = SLOGANS[state.mode] || SLOGANS.normal;
      taglineEl.style.opacity = '1';
    }, 120);
  }

  modalModeGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.segmented-option');
    if(!btn) return;
    modalModeGroup.querySelectorAll('.segmented-option').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.mode = btn.dataset.value;
    updateTagline();
  });

  updateTagline();

  /* ---------------------------------------------------------------------
     Color theme swatches (brand accent)
     --------------------------------------------------------------------- */
const THEME_COLORS = {
  violet: { a: '#9B87F5', b: '#82B5FF' },
  blue:   { a: '#82B5FF', b: '#7FE7E8' },
  teal:   { a: '#7FE7E8', b: '#A7E07A' },
  green:  { a: '#A7E07A', b: '#FFC46B' },
  orange: { a: '#FFC46B', b: '#FF98C3' },
  pink:   { a: '#FF98C3', b: '#9B87F5' }
};
  modalThemeSwatches.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if(!btn) return;
    modalThemeSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-active'));
    btn.classList.add('is-active');
    const t = THEME_COLORS[btn.dataset.theme];
    document.documentElement.style.setProperty('--accent', t.a);
    document.documentElement.style.setProperty('--accent-2', t.b);
  });

  /* ---------------------------------------------------------------------
     More settings (advanced) — lives inside the modal
     --------------------------------------------------------------------- */
  const moreBtn = document.getElementById('moreSettingsBtn');
  const morePanel = document.getElementById('moreSettingsPanel');
  moreBtn.addEventListener('click', () => {
    const isHidden = morePanel.hasAttribute('hidden');
    if(isHidden){ morePanel.removeAttribute('hidden'); moreBtn.setAttribute('aria-expanded','true'); }
    else{ morePanel.setAttribute('hidden',''); moreBtn.setAttribute('aria-expanded','false'); }
  });
  document.getElementById('announceDelay').addEventListener('change', e => {
    state.announceDelay = Math.max(0, parseInt(e.target.value,10) || 0);
  });
  document.getElementById('allowRepeatWinners').addEventListener('change', e => {
    state.allowRepeatWinners = e.target.checked;
  });
  document.getElementById('removeAfterWin').addEventListener('change', e => {
    state.removeAfterWin = e.target.checked;
  });

  document.getElementById('resetDataBtn').addEventListener('click', () => {
    if(!confirm('Reset the wheel back to the default 6 prizes? This clears your current list.')) return;
    state.items = defaultItems.map(i => ({ ...i, id: uid() }));
    persist(); renderItems(); drawWheel();
    resetResult();
    appSettingsModal.setAttribute('hidden','');
  });

  /* ---------------------------------------------------------------------
     Item list rendering
     --------------------------------------------------------------------- */
  let dragSrcId = null;

  function renderItems(){
    itemListEl.innerHTML = '';
    itemCountEl.textContent = state.items.length;

    if(state.items.length === 0){
      const li = document.createElement('li');
      li.className = 'empty-hint';
      li.textContent = 'No prizes yet — add your first item above.';
      itemListEl.appendChild(li);
      return;
    }

    state.items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item-row';
      li.draggable = true;
      li.dataset.id = item.id;

      const iconDef = ICONS[item.icon] || ICONS.gift;

      li.innerHTML = `
        <span class="item-dot" style="--dot:${item.color}"></span>
        <span class="item-name">${escapeHtml(item.name)}</span>
        <span class="item-icon" style="color:${item.color}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconDef.svg}</svg>
        </span>
        <span class="item-handle" title="Drag to reorder">
          <svg class="icon icon-sm" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>
        </span>
        <button class="item-delete" title="Delete" aria-label="Delete ${escapeHtml(item.name)}">
          <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;

      li.querySelector('.item-delete').addEventListener('click', () => {
        state.items = state.items.filter(i => i.id !== item.id);
        persist(); renderItems(); drawWheel();
      });

      li.addEventListener('dragstart', () => { dragSrcId = item.id; li.classList.add('dragging'); });
      li.addEventListener('dragend', () => { li.classList.remove('dragging'); });
      li.addEventListener('dragover', (e) => e.preventDefault());
      li.addEventListener('drop', (e) => {
        e.preventDefault();
        if(!dragSrcId || dragSrcId === item.id) return;
        const from = state.items.findIndex(i => i.id === dragSrcId);
        const to = state.items.findIndex(i => i.id === item.id);
        const [moved] = state.items.splice(from, 1);
        state.items.splice(to, 0, moved);
        persist(); renderItems(); drawWheel();
      });

      itemListEl.appendChild(li);
    });
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------------------------------------------------------------------
     Shuffle / Clear all
     --------------------------------------------------------------------- */
  document.getElementById('shuffleBtn').addEventListener('click', () => {
    for(let i = state.items.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [state.items[i], state.items[j]] = [state.items[j], state.items[i]];
    }
    persist(); renderItems(); drawWheel();
  });

  document.getElementById('clearAllBtn').addEventListener('click', () => {
    if(state.items.length && !confirm('Remove all prizes from the wheel?')) return;
    state.items = [];
    persist(); renderItems(); drawWheel();
    resetResult();
  });

  /* ---------------------------------------------------------------------
     Add item modal
     --------------------------------------------------------------------- */
  const addModal = document.getElementById('addItemModal');
  const newItemName = document.getElementById('newItemName');
  const colorPick = document.getElementById('newItemColorPick');
 let pickedColor = '#9B87F5';

  document.getElementById('addItemBtn').addEventListener('click', () => {
    newItemName.value = '';
    pickedColor = PALETTE[state.items.length % PALETTE.length];
    document.querySelectorAll('#newItemColorPick .swatch').forEach(s => {
      s.classList.toggle('is-active', s.dataset.color === pickedColor);
    });
    addModal.removeAttribute('hidden');
    setTimeout(() => newItemName.focus(), 50);
  });
  document.getElementById('cancelAddItem').addEventListener('click', () => addModal.setAttribute('hidden',''));
  addModal.addEventListener('click', (e) => { if(e.target === addModal) addModal.setAttribute('hidden',''); });

  colorPick.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if(!btn) return;
    pickedColor = btn.dataset.color;
    colorPick.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-active'));
    btn.classList.add('is-active');
  });

  function addNewItem(){
    const name = newItemName.value.trim();
    if(!name) { newItemName.focus(); return; }
    const icons = Object.keys(ICONS);
    const icon = icons[state.items.length % icons.length];
    state.items.push({ id: uid(), name, color: pickedColor, icon });
    persist(); renderItems(); drawWheel();
    addModal.setAttribute('hidden','');
  }
  document.getElementById('confirmAddItem').addEventListener('click', addNewItem);
  newItemName.addEventListener('keydown', (e) => { if(e.key === 'Enter') addNewItem(); });

  /* ---------------------------------------------------------------------
     Wheel drawing
     --------------------------------------------------------------------- */
  function sizeCanvas(){
    const rect = wheelWrap.getBoundingClientRect();
    const size = Math.round(rect.width);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawWheel(){
    sizeCanvas();
    const size = canvas.width / (window.devicePixelRatio || 1);
    const cx = size / 2, cy = size / 2;
    const R = size / 2 - 6;
    ctx.clearRect(0, 0, size, size);

    const items = state.items;
    const n = items.length;

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface') || '#fff';
    ctx.fill();

    if(n === 0){
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2);
      ctx.fillStyle = '#eceaf7';
      ctx.fill();
      ctx.fillStyle = '#9a9fb0';
      ctx.font = '600 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Add prizes to begin', cx, cy);
      return;
    }

    const seg = (Math.PI * 2) / n;

    items.forEach((item, i) => {
      const start = -Math.PI / 2 + i * seg;
      const end = start + seg;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R * 0.94, start, end);
      ctx.closePath();

      const grad = ctx.createLinearGradient(
        cx + Math.cos(start) * R, cy + Math.sin(start) * R,
        cx + Math.cos(end) * R, cy + Math.sin(end) * R
      );
      grad.addColorStop(0, shade(item.color, 12));
      grad.addColorStop(1, shade(item.color, -8));
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label + icon along the bisector
      const mid = start + seg / 2;
      const normalized = ((mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const flip = normalized > Math.PI / 2 && normalized < 1.5 * Math.PI;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(mid);
      if(flip) ctx.rotate(Math.PI);

      const dir = flip ? -1 : 1;

      // Text is auto-sized/wrapped so it never crosses the outer rim,
      // and never spills into the neighboring segment.
      const textStartR = R * 0.34;
      const textEndR = R * 0.88;
      const radialSpace = textEndR - textStartR;
      const tangentialSpace = 2 * ((textStartR + textEndR) / 2) * Math.sin(seg / 2) * 0.92;

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = flip ? 'right' : 'left';
      ctx.textBaseline = 'middle';

      drawFittedRadialLabel(ctx, item.name, dir, textStartR, radialSpace, tangentialSpace);

      ctx.restore();
    });

    // subtle inner ring
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.0)';
    ctx.fill();
  }

  // Fits a label within a wedge by shrinking font size and wrapping onto up
  // to 2 lines until it fits both the remaining radial length (so it never
  // crosses the rim) and the tangential wedge width (so it never crosses
  // into the neighboring slice). Falls back to a truncated ellipsis.
  function drawFittedRadialLabel(ctx, text, dir, startR, maxWidth, maxLineHeight){
    const fontFamily = '"Segoe UI", Inter, sans-serif';
    let fontPx = Math.min(20, Math.max(9, maxLineHeight * 0.85));

    function setFont(px){ ctx.font = `700 ${px}px ${fontFamily}`; }
    function wrapLines(px, maxLines){
      setFont(px);
      const words = text.split(' ');
      const lines = [];
      let cur = '';
      for(const w of words){
        const test = cur ? cur + ' ' + w : w;
        if(ctx.measureText(test).width > maxWidth && cur){
          lines.push(cur);
          cur = w;
          if(lines.length === maxLines - 1) break;
        } else {
          cur = test;
        }
      }
      if(cur) lines.push(cur);
      // fold any remaining words into the last line
      const consumed = lines.join(' ').split(' ').length;
      const remaining = words.slice(consumed).join(' ');
      if(remaining) lines[lines.length - 1] += ' ' + remaining;
      return lines.slice(0, maxLines);
    }

    const maxLines = maxLineHeight > fontPx * 2.1 ? 2 : 1;
    let lines = wrapLines(fontPx, maxLines);
    let fits = lines.every(l => ctx.measureText(l).width <= maxWidth) && (lines.length * fontPx * 1.15) <= maxLineHeight * (maxLines);

    while(!fits && fontPx > 8){
      fontPx -= 1;
      const ml = maxLineHeight > fontPx * 2.1 ? 2 : 1;
      lines = wrapLines(fontPx, ml);
      fits = lines.every(l => ctx.measureText(l).width <= maxWidth);
    }

    if(!fits){
      // last resort: single truncated line at the minimum size
      setFont(8);
      let t = text;
      while(ctx.measureText(t + '…').width > maxWidth && t.length > 1){ t = t.slice(0, -1); }
      lines = [t.length < text.length ? t + '…' : t];
      fontPx = 8;
    }

    setFont(fontPx);
    const lineGap = fontPx * 1.15;
    const totalH = (lines.length - 1) * lineGap;
    lines.forEach((line, idx) => {
      const y = -totalH / 2 + idx * lineGap;
      ctx.save();
      ctx.translate(0, y);
      ctx.fillText(line, dir * startR, 0);
      ctx.restore();
    });
  }

  function shade(hex, percent){
    const num = parseInt(hex.replace('#',''), 16);
    let r = (num >> 16) + Math.round(2.55 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(2.55 * percent);
    let b = (num & 0x0000FF) + Math.round(2.55 * percent);
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `rgb(${r},${g},${b})`;
  }

  window.addEventListener('resize', debounce(() => { drawWheel(); }, 150));
  function debounce(fn, ms){ let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  /* ---------------------------------------------------------------------
     Spin logic
     --------------------------------------------------------------------- */
  function resetResult(){
    resultCard.classList.remove('is-winner');
    resultTitle.textContent = 'Spin the wheel!';
    resultSub.textContent = 'Good luck!';
  }

  function pickWinnerIndex(){
    const n = state.items.length;
    if(n === 0) return -1;
    return Math.floor(Math.random() * n);
  }

  spinBtn.addEventListener('click', () => {
    if(state.spinning) return;
    if(state.items.length < 2){
      alert('Add at least two prizes to spin the wheel.');
      return;
    }

    const n = state.items.length;
    const seg = 360 / n;
    const winnerIndex = pickWinnerIndex();
    const winner = state.items[winnerIndex];

    // angle (deg) of winner segment center, measured clockwise from top
    const segCenter = winnerIndex * seg + seg / 2;
    // add a little jitter within segment so it doesn't always land dead-center
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const targetAngle = segCenter + jitter;

    const extraSpins = 6 + Math.floor(Math.random() * 3); // 6-8 full spins
    const targetMod = ((360 - targetAngle) % 360 + 360) % 360;
    const currentMod = ((state.rotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if(delta < 0) delta += 360;
    const finalRotation = state.rotation + extraSpins * 360 + delta;

    state.spinning = true;
    spinBtn.disabled = true;
    wheelWrap.classList.add('is-spinning');
    resultCard.classList.remove('is-winner');
    resultTitle.textContent = 'Spinning…';
    resultSub.textContent = 'Good luck!';

    const duration = state.duration * 1000;
    canvas.style.transition = `transform ${duration}ms cubic-bezier(0.14, 0.65, 0.1, 1)`;
    canvas.style.transform = `rotate(${finalRotation}deg)`;
    state.rotation = finalRotation;

    if(state.sound) playTick(duration);

    const onEnd = () => {
      canvas.removeEventListener('transitionend', onEnd);
      wheelWrap.classList.remove('is-spinning');
      state.spinning = false;
      spinBtn.disabled = false;

      setTimeout(() => handleSpinResult(winner, winnerIndex), state.announceDelay);
    };
    canvas.addEventListener('transitionend', onEnd);
  });

  // Resets the wheel's visual rotation to an equivalent small angle (0-360)
  // after items are removed, without animating the change.
  function snapRotation(){
    state.rotation = state.rotation % 360;
    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(${state.rotation}deg)`;
  }

  function declareWinner(item){
    resultCard.classList.add('is-winner');
    resultTitle.textContent = item.name;
    resultSub.textContent = 'Congratulations! 🎉';
    if(state.confetti) fireConfetti();
    if(state.sound) playChime();
  }

  function handleSpinResult(landed, landedIndex){
    if(state.mode === 'elimination'){
      // In Elimination mode, whatever the wheel lands on is knocked out —
      // the prize that survives every spin is the eventual winner.
      state.items.splice(landedIndex, 1);
      persist(); renderItems(); drawWheel(); snapRotation();

      if(state.items.length === 1){
        const finalWinner = state.items[0];
        setTimeout(() => declareWinner(finalWinner), 350);
      } else if(state.items.length === 0){
        resultCard.classList.remove('is-winner');
        resultTitle.textContent = `${landed.name} eliminated`;
        resultSub.textContent = 'No prizes left on the wheel.';
      } else {
        resultCard.classList.remove('is-winner');
        resultTitle.textContent = `${landed.name} eliminated`;
        resultSub.textContent = `${state.items.length} prizes left — spin again!`;
        if(state.sound) playEliminateSound();
      }
      return;
    }

    // Normal mode: whatever the wheel lands on is the winner.
    declareWinner(landed);

    if(state.removeAfterWin || !state.allowRepeatWinners){
      state.items.splice(landedIndex, 1);
      persist(); renderItems(); drawWheel(); snapRotation();
    }
  }

  /* ---------------------------------------------------------------------
     Sound (Web Audio API — no external files needed)
     --------------------------------------------------------------------- */
  let audioCtx = null;
  function getAudioCtx(){
    if(!audioCtx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function playTick(duration){
    const ac = getAudioCtx();
    if(!ac) return;
    let ticks = Math.floor(duration / 90);
    let i = 0;
    const interval = setInterval(() => {
      if(i >= ticks || state.spinning === false && i > 4){ clearInterval(interval); return; }
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.value = 900;
      g.gain.value = 0.03;
      o.connect(g); g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.02);
      i++;
    }, Math.max(60, 90 * (i / Math.max(ticks,1)) + 40));
  }

  function playChime(){
    const ac = getAudioCtx();
    if(!ac) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.001;
      o.connect(g); g.connect(ac.destination);
      const t0 = ac.currentTime + idx * 0.09;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
      o.start(t0);
      o.stop(t0 + 0.4);
    });
  }

  function playEliminateSound(){
    const ac = getAudioCtx();
    if(!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(320, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.25);
    g.gain.setValueAtTime(0.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.25);
    o.connect(g); g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.26);
  }

  /* ---------------------------------------------------------------------
     Confetti
     --------------------------------------------------------------------- */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiRAF = null;

  function resizeConfetti(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function fireConfetti(){
    const colors = state.items.map(i => i.color).concat([
  '#9B87F5',
  '#82B5FF',
  '#7FE7E8',
  '#A7E07A',
  '#FFC46B',
  '#FF98C3'
]);
    const count = 140;
    for(let i = 0; i < count; i++){
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height * 0.35,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -8 - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        gravity: 0.25 + Math.random() * 0.1,
        life: 0,
        maxLife: 110 + Math.random() * 40,
      });
    }
    if(!confettiRAF) confettiTick();
  }

  function confettiTick(){
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.vy += p.gravity * 0.05;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.life++;
      cctx.save();
      cctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rotation);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      cctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < confettiCanvas.height + 40);
    if(confettiParticles.length > 0){
      confettiRAF = requestAnimationFrame(confettiTick);
    } else {
      confettiRAF = null;
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  renderItems();
  drawWheel();
})();