// KisanSathi — Main App | Made by Tushar Sharma

// ---- NAVBAR ----
function initNav() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');
  burger?.addEventListener('click', () => menu?.classList.toggle('open'));

  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-menu a');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
    });
  }, { passive: true });
  links.forEach(a => a.addEventListener('click', () => menu?.classList.remove('open')));
}

// ---- SMOOTH SCROLL ----
function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ---- CROP CALENDAR ----
const CAL = [
  { n:'🌾 Wheat',      s:[10,11,12], g:[12,1,2],         h:[3,4]           },
  { n:'🌿 Rice',       s:[6,7],      g:[7,8,9],           h:[10,11]         },
  { n:'🌻 Mustard',    s:[10,11],    g:[11,12,1],         h:[2,3]           },
  { n:'🌽 Maize',      s:[6,7],      g:[7,8],             h:[9,10]          },
  { n:'🥔 Potato',     s:[10,11],    g:[11,12],           h:[1,2]           },
  { n:'🎋 Sugarcane',  s:[2,3],      g:[3,4,5,6,7,8,9],  h:[10,11,12,1]   },
  { n:'🧅 Onion',      s:[10,11],    g:[11,12,1,2],       h:[3,4]           },
  { n:'🍅 Tomato',     s:[6,7],      g:[7,8,9],           h:[9,10,11]       },
];
const MNAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildCalendar() {
  const tbody = document.getElementById('calBody');
  if (!tbody) return;
  tbody.innerHTML = CAL.map(r => {
    const cells = MNAMES.map((_, i) => {
      const m = i + 1;
      if (r.s.includes(m)) return `<td><span class="dot s" title="Sowing">S</span></td>`;
      if (r.g.includes(m)) return `<td><span class="dot g" title="Growing">G</span></td>`;
      if (r.h.includes(m)) return `<td><span class="dot h" title="Harvest">H</span></td>`;
      return `<td style="color:#ccc">—</td>`;
    }).join('');
    return `<tr><td class="cal-crop">${r.n}</td>${cells}</tr>`;
  }).join('');
}

// ---- PEST GUIDE ----
async function buildPests() {
  const grid = document.getElementById('pestGrid');
  if (!grid) return;

  let pests = [];
  try {
    const r = await fetch('data/data.json');
    const j = await r.json();
    pests = j.pests;
  } catch {
    grid.innerHTML = '<p style="text-align:center;color:#888;padding:2rem;">Unable to load pest data. Please refresh.</p>';
    return;
  }

  grid.innerHTML = pests.map(p => `
    <div class="pc">
      <div class="pc-top">
        <div class="pc-icon">${p.emoji}</div>
        <div>
          <h3>${p.name}</h3>
          <div class="pc-crops">Affects: ${p.affects}</div>
        </div>
      </div>

      <div class="pc-body">
        <div class="pc-row">
          <div class="pr-label">How to Identify</div>
          <div class="pr-text">
            ${p.identify}
            <br><span class="hi">${p.identify_hi}</span>
          </div>
        </div>

        <div class="pc-row">
          <div class="pr-label">Damage Caused</div>
          <div class="pr-text">
            ${p.damage}
            <br><span class="hi">${p.damage_hi}</span>
          </div>
        </div>

        <div class="pc-row treatment">
          <div class="pr-label">💊 Treatment</div>
          <div class="pr-text">
            ${p.treatment}
            <br><span class="hi">${p.treatment_hi}</span>
          </div>
        </div>

        <div class="pc-row" style="margin-top:.8rem">
          <div class="pr-label">Prevention</div>
          <div class="pr-text">
            ${p.prevention}
            <br><span class="hi">${p.prevention_hi}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const els = document.querySelectorAll('.feat-tile,.mc,.pc,.hs-box');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.animation = 'up .5s ease both'; obs.unobserve(e.target); }
    });
  }, { threshold: .1 });
  els.forEach(el => obs.observe(el));
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScroll();
  buildCalendar();
  buildPests();
  setTimeout(initReveal, 200);
});
