/* Coding Clicker: cookie-clicker-like single-file JS game
   Host on GitHub and load via console or bookmarklet (see README.md)
*/
(function(){
  if(window.__coding_clicker_loaded) return; window.__coding_clicker_loaded = true;
  const STORE_KEY = 'codingclicker:v1';

  const defaults = {
    coins: 0,
    cpc: 1,           // coins per click
    cps: 0,           // coins per second (auto)
    upgrades: {       // purchased counts
      cursor: 0,
      tutor: 0
    }
  };

  // Safe localStorage access (some pages block access and throw SecurityError)
  function safeGetItem(key){ try{ return localStorage.getItem(key); }catch(e){ return null; } }
  function safeSetItem(key, val){ try{ localStorage.setItem(key, val); return true; }catch(e){ return false; } }

  let state = Object.assign({}, defaults, JSON.parse(safeGetItem(STORE_KEY) || '{}'));

  function save(){ safeSetItem(STORE_KEY, JSON.stringify(state)); }

  // UI
  const id = 'codingclicker-overlay';
  if(document.getElementById(id)) return;

  const css = document.createElement('style'); css.id='codingclicker-style';
  css.textContent = `#${id}{box-sizing:border-box;position:fixed;right:18px;bottom:18px;width:360px;max-width:92vw;background:#071226;color:#e6f1ff;padding:14px;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.6);z-index:2147483647;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif}#${id} *,#${id} *:before,#${id} *:after{box-sizing:inherit}#${id} h3{margin:0 0 8px 0;font-size:16px}#${id} .row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}#${id} button{background:#2563eb;border:0;padding:8px 10px;color:white;border-radius:8px;cursor:pointer}#${id} button.secondary{background:#334155}#${id} .bigclick{display:block;width:100%;padding:12px 14px;border-radius:10px;background:linear-gradient(180deg,#1f6ff3,#1854c1);font-size:18px;text-align:center;white-space:normal;word-break:break-word;overflow-wrap:break-word}#${id} .muted{color:#9fb}
  `;
  document.head.appendChild(css);

  const wrap = document.createElement('div'); wrap.id = id;
  wrap.innerHTML = `
    <div class="row"><h3>Coding Clicker</h3><div style="margin-left:auto" class="muted">Coins: <strong id="cc-coins">${state.coins}</strong></div></div>
    <div style="margin:10px 0"><div id="cc-click" class="bigclick">Click me (+<span id="cc-cpc">${state.cpc}</span>)</div></div>
    <div class="row" style="margin-bottom:8px"><div class="muted">CPS: <span id="cc-cps">${state.cps}</span></div><div style="margin-left:auto"><button id="cc-reset" class="secondary">Reset</button> <button id="cc-close" class="secondary">Close</button></div></div>
    <div style="margin-top:6px">
      <div style="font-size:13px;margin-bottom:6px">Upgrades</div>
      <div class="row" style="margin-bottom:6px"><div style="flex:1">Cursor (adds +1 cps)</div><div><button id="buy-cursor">Buy (<span id="cost-cursor">10</span>)</button></div></div>
      <div class="row"><div style="flex:1">Tutor (adds +1 cpc)</div><div><button id="buy-tutor">Buy (<span id="cost-tutor">25</span>)</button></div></div>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#9fb">Tip: Paste the console loader or use the bookmarklet (see README).</div>
  `;
  document.body.appendChild(wrap);

  // Elements
  const coinsEl = document.getElementById('cc-coins');
  const cpcEl = document.getElementById('cc-cpc');
  const cpsEl = document.getElementById('cc-cps');
  const clickEl = document.getElementById('cc-click');
  const buyCursorBtn = document.getElementById('buy-cursor');
  const buyTutorBtn = document.getElementById('buy-tutor');
  const costCursorEl = document.getElementById('cost-cursor');
  const costTutorEl = document.getElementById('cost-tutor');
  const resetBtn = document.getElementById('cc-reset');
  const closeBtn = document.getElementById('cc-close');

  function render(){ coinsEl.textContent = Math.floor(state.coins); cpcEl.textContent = state.cpc; cpsEl.textContent = state.cps; costCursorEl.textContent = cursorCost(); costTutorEl.textContent = tutorCost(); }

  function cursorCost(){ return Math.floor(10 * Math.pow(1.15, state.upgrades.cursor)); }
  function tutorCost(){ return Math.floor(25 * Math.pow(1.17, state.upgrades.tutor)); }

  // Click handler
  clickEl.addEventListener('click', ()=>{ state.coins += state.cpc; render(); save(); });

  // Buy handlers
  buyCursorBtn.addEventListener('click', ()=>{
    const cost = cursorCost(); if(state.coins >= cost){ state.coins -= cost; state.upgrades.cursor += 1; state.cps += 1; save(); render(); } else { alert('Not enough coins'); }
  });
  buyTutorBtn.addEventListener('click', ()=>{
    const cost = tutorCost(); if(state.coins >= cost){ state.coins -= cost; state.upgrades.tutor += 1; state.cpc += 1; save(); render(); } else { alert('Not enough coins'); }
  });

  resetBtn.addEventListener('click', ()=>{
    if(confirm('Reset all progress?')){ state = Object.assign({}, defaults); save(); render(); }
  });
  closeBtn.addEventListener('click', ()=>{ save(); cleanup(); });

  // Auto increment by CPS every 1s (fractional cps supported)
  let lastTick = Date.now();
  const tickInterval = setInterval(()=>{
    const now = Date.now(); const dt = (now - lastTick)/1000; lastTick = now;
    state.coins += state.cps * dt; render(); save();
  }, 1000);

  function cleanup(){ const s=document.getElementById('codingclicker-style'); if(s) s.remove(); const o=document.getElementById(id); if(o) o.remove(); clearInterval(tickInterval); try{ delete window.__coding_clicker_loaded; }catch(e){} }

  // Expose API
  window.CodingGame = window.CodingGame || {};
  window.CodingGame.getState = ()=>JSON.parse(safeGetItem(STORE_KEY)||'{}');
  window.CodingGame.addCoins = (n)=>{ state.coins = (state.coins||0)+Number(n||0); save(); render(); };

  render();
})();
