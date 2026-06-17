// KisanSathi — Mandi Prices + Fertilizer Calc | Made by Tushar Sharma

// ---- MANDI PRICES ----
async function initMandi() {
  try {
    const r = await fetch('data/data.json');
    const j = await r.json();
    renderMandi(j.mandi);
  } catch {
    renderMandiFallback();
  }
}

function renderMandi(data) {
  const grid = document.getElementById('mandiGrid');
  if (!grid) return;
  grid.innerHTML = data.map(p => {
    const diff = p.price - p.prev;
    const up   = diff >= 0;
    const pct  = ((Math.abs(diff) / p.prev) * 100).toFixed(1);
    return `
      <div class="mc">
        <div class="me">${p.emoji}</div>
        <div class="mn">${p.name}</div>
        <div class="mp">₹${p.price.toLocaleString('en-IN')}</div>
        <div class="mu">${p.unit}</div>
        <div class="ms">${p.state}</div>
        <div class="md ${up ? 'up' : 'dn'}">
          ${up ? '▲' : '▼'} ₹${Math.abs(diff)} (${pct}%)
        </div>
      </div>`;
  }).join('');
}

function renderMandiFallback() {
  const grid = document.getElementById('mandiGrid');
  if (grid) grid.innerHTML = '<p style="color:rgba(255,255,255,.4);text-align:center;grid-column:1/-1;padding:2rem;">Unable to load prices. Please refresh the page.</p>';
}

// ---- FERTILIZER CALCULATOR ----
const FERT = {
  wheat:     {urea:120, dap:60,  potash:40},
  rice:      {urea:100, dap:50,  potash:50},
  mustard:   {urea:80,  dap:40,  potash:20},
  sugarcane: {urea:150, dap:80,  potash:60},
  maize:     {urea:100, dap:60,  potash:40},
  potato:    {urea:120, dap:100, potash:120},
  onion:     {urea:100, dap:80,  potash:100},
  tomato:    {urea:100, dap:80,  potash:80},
  other:     {urea:100, dap:60,  potash:40},
};

const TO_HA = { hectare:1, bigha:0.2529, acre:0.4047, guntha:0.01012 };

function calcFertilizer() {
  const crop = document.getElementById('fCrop').value;
  const area = parseFloat(document.getElementById('fArea').value);
  const unit = document.getElementById('fUnit').value;

  if (!crop || !area || area <= 0) {
    alert('Please select a crop and enter a valid field area.');
    return;
  }

  const ha     = area * (TO_HA[unit] || 1);
  const base   = FERT[crop] || FERT.other;
  const urea   = Math.round(base.urea   * ha);
  const dap    = Math.round(base.dap    * ha);
  const potash = Math.round(base.potash * ha);

  document.getElementById('fUrea').textContent   = urea;
  document.getElementById('fDAP').textContent    = dap;
  document.getElementById('fPotash').textContent = potash;

  // Approx cost estimate
  const cost = (urea * 6) + (dap * 27) + (potash * 17);
  const ce   = document.getElementById('fCost');
  if (ce) ce.textContent = '≈ ₹' + cost.toLocaleString('en-IN') + ' estimated total cost';

  const res = document.getElementById('calcResult');
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', initMandi);
