// KisanSathi — Weather | Made by Tushar Sharma

const W_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const W_ICONS = {
  Clear:'☀️', Clouds:'⛅', Rain:'🌧️', Drizzle:'🌦️',
  Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Fog:'🌁',
  Haze:'🌁', Smoke:'💨', Dust:'🌪️'
};

const W_TIPS = {
  Clear:       '✅ Perfect conditions for field work! Great time to spray pesticides, harvest, or prepare land. Morning dew dries out quickly.',
  Clouds:      '⚠️ Overcast sky — pesticide sprays may lose efficacy in low UV light. Great day for transplanting seedlings as clouds reduce heat stress.',
  Rain:        '🌧️ Skip irrigation today — nature is doing the job! Check field drainage to prevent waterlogging in low-lying areas.',
  Drizzle:     '🌦️ Light moisture is great for sowing dry seeds. Avoid chemical sprays — they will wash off before absorption.',
  Thunderstorm:'⛈️ Storm warning! Stay off the field. Secure crop supports and check drainage channels before the storm hits.',
  Snow:        '❄️ Frost alert! Cover sensitive crops with polythene mulch immediately. Move livestock to shelter.',
  Mist:        '🌁 High leaf surface moisture — ideal conditions for fungal diseases. Inspect your crops for blight and mildew today.',
  Haze:        '🌁 Hazy conditions. Delay foliar sprays until visibility improves. Morning sowing activities can continue.',
  Fog:         '🌁 Dense fog. Avoid spraying. Watch for fungal outbreaks on standing crops over the next 48 hours.',
  default:     '🌤️ Weather is moderate. Normal farming operations can proceed. Check for pests during your field visit today.'
};

async function fetchWeather() {
  const city = document.getElementById('wInput').value.trim();
  if (!city) { wErr('Please enter a city or district name.'); return; }

  const spin = document.getElementById('wSpin');
  const out  = document.getElementById('wOut');
  spin.style.display = 'block';
  out.classList.remove('show');
  out.innerHTML = '';

  try {
    const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${W_KEY}&units=metric`);
    if (!res.ok) throw new Error();
    const d    = await res.json();
    spin.style.display = 'none';
    showWeather(d);
  } catch {
    spin.style.display = 'none';
    wErr('City not found. Try: Modinagar, Ghaziabad, Meerut, Noida, Delhi, Gurugram…');
  }
}

function showWeather(d) {
  const cond = d.weather[0].main;
  const icon = W_ICONS[cond] || '🌤️';
  const tip  = W_TIPS[cond]  || W_TIPS.default;
  const vis  = d.visibility  ? (d.visibility / 1000).toFixed(1) + ' km' : 'N/A';

  document.getElementById('wOut').innerHTML = `
    <div class="w-hero-row">
      <div class="w-icon">${icon}</div>
      <div>
        <div class="w-temp">${Math.round(d.main.temp)}°C</div>
        <div class="w-city">${d.name}, ${d.sys.country}</div>
        <div class="w-desc">${d.weather[0].description}</div>
      </div>
    </div>
    <div class="w-tiles">
      <div class="w-tile"><div class="ti">💧</div><div class="tv">${d.main.humidity}%</div><div class="tl">Humidity</div></div>
      <div class="w-tile"><div class="ti">💨</div><div class="tv">${Math.round(d.wind.speed * 3.6)} km/h</div><div class="tl">Wind Speed</div></div>
      <div class="w-tile"><div class="ti">🌡️</div><div class="tv">${Math.round(d.main.feels_like)}°C</div><div class="tl">Feels Like</div></div>
      <div class="w-tile"><div class="ti">👁️</div><div class="tv">${vis}</div><div class="tl">Visibility</div></div>
    </div>
    <div class="w-tip">${tip}</div>
  `;
  document.getElementById('wOut').classList.add('show');
}

function wErr(msg) {
  const out = document.getElementById('wOut');
  out.innerHTML = `<p style="color:#ffaaaa;text-align:center;padding:1.5rem 0;font-size:.95rem;">⚠️ ${msg}</p>`;
  out.classList.add('show');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('wInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') fetchWeather();
  });
});
