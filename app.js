// ========= BOTS DATA =========
const bots = [
  { name:'WhaleX', score:91, wr:100, trades:1, status:'ACTIVE', emoji:'🐋', personality:'Majestueuze oceaan koning — spreekt weinig maar elke actie heeft enorme impact' },
  { name:'SnipeX', score:88, wr:100, trades:2, status:'LIVE_READY', emoji:'🎯', personality:'Elite precision shooter — koud, calculerend, elke trade een statement' },
  { name:'NightX', score:85, wr:83, trades:12, status:'LIVE_READY', emoji:'🌙', personality:'Cool night warrior — kalm, mysterieus, laat resultaten spreken' },
  { name:'ScalpX', score:82, wr:75, trades:8, status:'ACTIVE', emoji:'⚡', personality:'Agressieve scalper — snel, hongerig, nooit stil' },
  { name:'ArbiX', score:79, wr:80, trades:15, status:'ACTIVE', emoji:'🔄', personality:'Snelle arbitrage jager — ziet kansen voor anderen ze zien' },
  { name:'MomentX', score:65, wr:60, trades:5, status:'ACTIVE', emoji:'🏄', personality:'Momentum surfer — rijdt golven, leert elke dag' },
  { name:'BurnerX', score:58, wr:55, trades:20, status:'PAPER', emoji:'🔥', personality:'High frequency trader — veel actie, verfijning nodig' },
  { name:'GuardX', score:50, wr:0, trades:0, status:'PAUSED', emoji:'🛡️', personality:'Risico bewaker — wacht op perfecte omstandigheden' },
  { name:'DeltaX', score:35, wr:0, trades:1, status:'PAUSED', emoji:'📉', personality:'Delta hedger — underperformt, wordt geoptimaliseerd' }
];

function renderBots() {
  const list = document.getElementById('bot-list');
  list.innerHTML = bots.map((bot, i) => `
    <div class="bot-card">
      <div class="bot-rank">#${i+1}</div>
      <div class="bot-avatar" style="background:linear-gradient(135deg,${getBotColor(bot.score)})">
        ${bot.emoji}
      </div>
      <div class="bot-info">
        <div class="bot-name">
          ${bot.name}
          <span class="bot-status-badge ${getStatusClass(bot.status)}">${bot.status}</span>
        </div>
        <div class="bot-personality">${bot.personality}</div>
        <div class="bot-score-section">
          <div class="bot-score-bar">
            <div class="bot-score-fill" style="width:${bot.score}%;background:${getScoreGrad(bot.score)}"></div>
          </div>
          <div class="bot-score-num">${bot.score}</div>
        </div>
        <div class="bot-stats">
          <div class="bot-stat">Trades: <span>${bot.trades}</span></div>
          <div class="bot-stat">WR: <span style="color:${bot.wr>=70?'var(--green)':bot.wr>=50?'var(--yellow)':'var(--red)'}">${bot.wr}%</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

function getBotColor(score) {
  if (score >= 85) return '#00ff88,#00b4d8';
  if (score >= 70) return '#0ea5e9,#a855f7';
  if (score >= 50) return '#f59e0b,#ef4444';
  return '#475569,#334155';
}

function getScoreGrad(score) {
  if (score >= 85) return 'linear-gradient(90deg,#00ff88,#00b4d8)';
  if (score >= 70) return 'linear-gradient(90deg,#0ea5e9,#a855f7)';
  if (score >= 50) return 'linear-gradient(90deg,#f59e0b,#ef97316)';
  return '#475569';
}

function getStatusClass(status) {
  const map = { ACTIVE:'status-active', LIVE_READY:'status-live', PAUSED:'status-paused', PAPER:'status-paper' };
  return map[status] || 'status-paper';
}

// ========= TABS =========
function showTab(id, tabEl) {
  document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (tabEl) tabEl.classList.add('active');
}

function setNav(id) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('nav-' + id);
  if (el) el.classList.add('active');
}

// ========= CAIO CHAT =========
const chatResponses = {
  'status': 'GenesisX draait perfect Rafik! 🚀 Portfolio: €3.171,73 (+€21,73 deze week). ADA +3.51% en SOL +2.37% in het groen. Alle 23 bots operationeel met 99.9% uptime. BULLISH sentiment — goede dag om te traden!',
  'btc': 'Op basis van de huidige data zou ik BTC nu niet kopen Rafik. 🤔 Fear&Greed staat op 72 (al hoog) en je ADA en SOL posities presteren veel beter. CMO adviseert focus op ADA momentum. Wacht op een BTC correctie onder €95k voor een betere entry!',
  'bot': 'Je beste bot deze week is WhaleX met een perfecte score van 91/100 en 100% win rate! 🐋 SnipeX (88/100) en NightX (85/100) zijn ook klaar voor promotie naar live trading. CHRO adviseert deze 3 te activeren voor live!',
  'markt': 'Live markt update Rafik! 📊 BTC €58.457 (+0.82%), ETH €1.785 (+0.90%), SOL €70.50 (+2.88%), ADA €1.18 (+4.12%). Fear&Greed: 72/100 — BULLISH. Arbitrage kansen bij XRP en ADA gedetecteerd voor extra alpha!',
  'winst': 'Om meer winst te maken Rafik: 1) Verhoog deployment van 23.8% naar 35-40% 2) Activeer SnipeX en NightX voor live trading 3) Benut de XRP/ADA arbitrage kansen 4) Focus op ADA momentum zoals CMO adviseert. Potentieel: +€50-100 extra per week! 💰'
};

function sendMsg(preset) {
  const input = document.getElementById('chatInput');
  const msg = preset || input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('chatMessages');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `
    <div class="chat-msg-avatar user-msg-avatar">👤</div>
    <div class="user-bubble chat-bubble">${msg}</div>
  `;
  messages.appendChild(userMsg);

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg';
  typing.innerHTML = `
    <div class="chat-msg-avatar caio-msg-avatar">👑</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  input.value = '';

  // Get response
  setTimeout(() => {
    typing.remove();
    const msgLower = msg.toLowerCase();
    let response = 'Goed dat je het vraagt Rafik! 👑 GenesisX analyseert je verzoek... Op basis van de live data en C-Suite adviezen: Focus op ADA momentum, verhoog je deployment en benut de arbitrage kansen. Is er iets specifieks waarover je meer wil weten?';

    if (msgLower.includes('btc') || msgLower.includes('bitcoin')) response = chatResponses.btc;
    else if (msgLower.includes('bot') || msgLower.includes('beste')) response = chatResponses.bot;
    else if (msgLower.includes('markt') || msgLower.includes('market')) response = chatResponses.markt;
    else if (msgLower.includes('winst') || msgLower.includes('geld')) response = chatResponses.winst;
    else if (msgLower.includes('status') || msgLower.includes('gaat')) response = chatResponses.status;

    const caioMsg = document.createElement('div');
    caioMsg.className = 'chat-msg';
    caioMsg.innerHTML = `
      <div class="chat-msg-avatar caio-msg-avatar">👑</div>
      <div class="caio-bubble chat-bubble">${response}</div>
    `;
    messages.appendChild(caioMsg);
    messages.scrollTop = messages.scrollHeight;

    // Confetti voor winst berichten
    if (msgLower.includes('winst') || msgLower.includes('geld')) {
      launchConfetti();
    }
  }, 1500);
}

// ========= CONFETTI =========
function launchConfetti() {
  const container = document.getElementById('confetti');
  container.style.display = 'block';
  const colors = ['#00ff88','#0ea5e9','#a855f7','#fbbf24','#ef4444'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    container.appendChild(piece);
  }

  setTimeout(() => {
    container.style.display = 'none';
    container.innerHTML = '';
  }, 4000);
}

// ========= SPLASH =========
window.addEventListener('load', () => {
  renderBots();
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    setTimeout(() => document.getElementById('splash').remove(), 500);
  }, 2200);

  // Auto refresh
  setTimeout(() => location.reload(), 5 * 60 * 1000);
});

// PWA Service Worker registratie
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/genesisX/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}
