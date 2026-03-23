const API_KEY = '934239749a24fd7c7159f909944a2f9e';

// ── Dropdown weather fetch ────────────────────────────
const select = document.getElementById('city-select');
select.addEventListener('change', function () {
  const city = this.value;
  if (!city) return;
  fetchAndDisplay(city);
});

async function fetchAndDisplay(city) {
  const loader = document.getElementById('loader');
  const card   = document.getElementById('weather-card');
  const errMsg = document.getElementById('error-msg');

  card.classList.add('hidden');
  errMsg.classList.add('hidden');
  loader.classList.remove('hidden');

  const data = await fetchWeather(city);
  loader.classList.add('hidden');

  if (!data) { errMsg.classList.remove('hidden'); return; }
  renderCard(data);
}

// ── Core fetch function (reused by chatbot too) ───────
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.cod !== 200) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Render main weather card ──────────────────────────
function renderCard(data) {
  document.getElementById('city-name').textContent    = data.name;
  document.getElementById('description').textContent  = data.weather[0].description;
  document.getElementById('feels-like').textContent   = `Feels like ${data.main.feels_like.toFixed(1)}°C`;
  document.getElementById('main-temp').textContent    = `${Math.round(data.main.temp)}°C`;
  document.getElementById('temp-min').textContent     = `${data.main.temp_min.toFixed(1)}°C`;
  document.getElementById('temp-max').textContent     = `${data.main.temp_max.toFixed(1)}°C`;
  document.getElementById('humidity').textContent     = `${data.main.humidity}%`;
  document.getElementById('wind').textContent         = `${data.wind.speed} m/s`;

  const icon = document.getElementById('weather-icon');
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.alt = data.weather[0].description;

  const rainBox = document.getElementById('rain-info');
  if (data.rain) {
    rainBox.textContent = `🌧️ Rain in last 1hr: ${data.rain['1h'] || 0} mm`;
    rainBox.classList.remove('hidden');
  } else {
    rainBox.textContent = '☀️ No rain currently reported';
    rainBox.classList.remove('hidden');
  }

  document.getElementById('suggestion-box').textContent = getOutfitTip(data);
  document.getElementById('weather-card').classList.remove('hidden');
}

// ── Outfit / travel suggestion logic ─────────────────
function getOutfitTip(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description.toLowerCase();
  const isRaining = desc.includes('rain') || desc.includes('drizzle');

  let tip = '👗 What to wear: ';
  if (temp >= 35)       tip += 'Very hot! Light cotton clothes, sunglasses, and stay hydrated. 🥵';
  else if (temp >= 28)  tip += 'Warm weather — shorts and a t-shirt work great. 😎';
  else if (temp >= 20)  tip += 'Comfortable! Light layers or a casual outfit. 🙂';
  else if (temp >= 10)  tip += 'Cool — bring a jacket or light sweater. 🧥';
  else                  tip += 'Cold! Bundle up with a heavy coat and warm layers. 🧣';

  if (isRaining) tip += ' Don\'t forget an umbrella! ☂️';
  return tip;
}

// ── Chatbot ───────────────────────────────────────────
const chatToggle  = document.getElementById('chat-toggle');
const chatWindow  = document.getElementById('chat-window');
const chatClose   = document.getElementById('chat-close');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');
const chatMessages= document.getElementById('chat-messages');
const bubbleDot   = document.getElementById('bubble-dot');

chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
  bubbleDot.classList.add('hidden');
});
chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));

chatSend.addEventListener('click', handleChat);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleChat(); });

function fillInput(el) {
  chatInput.value = el.textContent;
  chatInput.focus();
}

function handleChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  processMessage(text.toLowerCase());
}

function addMessage(text, sender) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${sender}`;

  const avatar = document.createElement('span');
  avatar.className = 'msg-avatar';
  avatar.textContent = sender === 'bot' ? '🌤️' : '🧑';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot typing';
  wrap.id = 'typing-indicator';

  const avatar = document.createElement('span');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🌤️';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ── Parse what the user is asking ────────────────────
async function processMessage(text) {
  showTyping();

  // Compare two cities
  const compareMatch = text.match(/compare (.+?) and (.+)/);
  if (compareMatch) {
    const city1 = capitalise(compareMatch[1].trim());
    const city2 = capitalise(compareMatch[2].trim());
    const [d1, d2] = await Promise.all([fetchWeather(city1), fetchWeather(city2)]);
    removeTyping();
    if (!d1 || !d2) {
      addMessage("❌ Couldn't find one or both cities. Try again!", 'bot');
      return;
    }
    addMessage(buildCompare(d1, d2), 'bot');
    return;
  }

  // Outfit query
  if (text.includes('wear') || text.includes('outfit') || text.includes('dress')) {
    const city = extractCity(text);
    if (city) {
      const data = await fetchWeather(city);
      removeTyping();
      if (!data) { addMessage("❌ City not found!", 'bot'); return; }
      addMessage(`${getOutfitTip(data)} (Based on current ${Math.round(data.main.temp)}°C in ${data.name})`, 'bot');
      return;
    }
  }

  // Travel tip
  if (text.includes('travel') || text.includes('visit') || text.includes('go to')) {
    const city = extractCity(text);
    if (city) {
      const data = await fetchWeather(city);
      removeTyping();
      if (!data) { addMessage("❌ City not found!", 'bot'); return; }
      addMessage(buildTravelTip(data), 'bot');
      return;
    }
  }

  // General weather query
  const city = extractCity(text);
  if (city) {
    const data = await fetchWeather(city);
    removeTyping();
    if (!data) { addMessage(`❌ Couldn't find weather for <b>${city}</b>. Check the spelling?`, 'bot'); return; }
    addMessage(buildWeatherReply(data), 'bot');
    return;
  }

  removeTyping();
  addMessage("🤔 I didn't catch that. Try asking something like <b>\"Weather in Paris\"</b> or <b>\"Compare Tokyo and Berlin\"</b>.", 'bot');
}

// ── Response builders ─────────────────────────────────
function buildWeatherReply(data) {
  const rain = data.rain ? `🌧️ Rain: ${data.rain['1h'] || 0}mm in last hour.` : '☀️ No rain reported.';
  return `
    <b>${data.name}</b> right now:<br/>
    🌡️ Temp: ${Math.round(data.main.temp)}°C (${data.weather[0].description})<br/>
    📉 Min: ${data.main.temp_min.toFixed(1)}°C &nbsp;|&nbsp; 📈 Max: ${data.main.temp_max.toFixed(1)}°C<br/>
    💧 Humidity: ${data.main.humidity}%<br/>
    💨 Wind: ${data.wind.speed} m/s<br/>
    ${rain}
  `;
}

function buildCompare(d1, d2) {
  const winner = d1.main.temp > d2.main.temp ? d1.name : d2.name;
  return `
    <b>Comparison: ${d1.name} vs ${d2.name}</b><br/><br/>
    🌡️ Temp: ${Math.round(d1.main.temp)}°C &nbsp;|&nbsp; ${Math.round(d2.main.temp)}°C<br/>
    📉 Min: ${d1.main.temp_min.toFixed(1)}°C &nbsp;|&nbsp; ${d2.main.temp_min.toFixed(1)}°C<br/>
    📈 Max: ${d1.main.temp_max.toFixed(1)}°C &nbsp;|&nbsp; ${d2.main.temp_max.toFixed(1)}°C<br/>
    💧 Humidity: ${d1.main.humidity}% &nbsp;|&nbsp; ${d2.main.humidity}%<br/>
    💨 Wind: ${d1.wind.speed} m/s &nbsp;|&nbsp; ${d2.wind.speed} m/s<br/><br/>
    🏆 <b>${winner}</b> is warmer right now!
  `;
}

function buildTravelTip(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  let tip = '';
  if (temp >= 30)      tip = 'Pack light clothes and sunscreen. It\'s hot! ☀️';
  else if (temp >= 20) tip = 'Great travel weather! A light jacket for evenings. 🌤️';
  else if (temp >= 10) tip = 'Bring layers — it can get chilly. 🍂';
  else                 tip = 'Bundle up! It\'s cold there right now. 🧥';

  return `
    <b>Travel tip for ${data.name}:</b><br/>
    Currently ${Math.round(data.main.temp)}°C with ${desc}.<br/><br/>
    ${tip}
  `;
}

// ── Helpers ───────────────────────────────────────────
const knownCities = [
  'london','new york','tokyo','paris','dubai','singapore',
  'sydney','mumbai','toronto','berlin','bangkok','seoul',
  'rome','madrid','amsterdam','beijing','shanghai','cairo',
  'moscow','istanbul','mexico city','los angeles','chicago',
  'kolkata','delhi','karachi','lagos','nairobi','cape town',
  'bangalore'
];

function extractCity(text) {
  for (const city of knownCities) {
    if (text.includes(city)) return capitalise(city);
  }
  // fallback: grab words after "in" or "for"
  const match = text.match(/(?:in|for|about|of)\s+([a-z\s]+?)(?:\?|$)/);
  if (match) return capitalise(match[1].trim());
  return null;
}

function capitalise(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}