/* ========== PROMISE DAY – Vanilla JS ========== */

// ---------- Easy to edit: Letter content (Gift 3) ----------
// Write your own message here; line breaks preserved.
const LETTER_CONTENT = `I love the fact you made it till here,

First of all, I made this because I wanted to make this day special for you,
koi nahi toh mai hi sahi ehehe, chaahe kara maine kuch bhi nahi hai but firr bhi😭. So now I just wanted to say you’re officially stuck with me.
I’ll annoy you, support you, reels bhejunga mastt and steal your time just like I said.
But mostly, I’ll always be here for you. You can count on me.
Promise.
And thank youuuuu for always being there for me, am so luckyyyy and blessed to have you in my life.
(btw speaker pe click karke dekho)

Glittery Pen✨`;

// ---------- Easy to edit: Temporary text when user clicks NO (up to 3 messages) ----------
const NO_CLICK_MESSAGES = [
  'Yaar why yawr :(',
  'Firse No maine ro dena hai',
  'You cant escape tho hehee',
];

// ---------- DOM refs ----------
const disclaimerModal = document.getElementById('disclaimer-modal');
const disclaimerBtn = document.getElementById('disclaimer-btn');
const introOverlay = document.getElementById('intro-overlay');
const introBtn = document.getElementById('intro-btn');
const gameContainer = document.getElementById('game-container');
const giftsSection = document.getElementById('gifts-section');
const progressText = document.getElementById('progress-text');
const cards = [
  document.getElementById('card-1'),
  document.getElementById('card-2'),
  document.getElementById('card-3'),
];
const transitionText = document.getElementById('transition-text');
const promiseCard = document.getElementById('promise-card');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const giftCards = document.querySelectorAll('.gift-card');
const giftScreens = [
  document.getElementById('gift-screen-1'),
  document.getElementById('gift-screen-2'),
  document.getElementById('gift-screen-3'),
];
const closeGiftBtns = document.querySelectorAll('.close-gift-btn');
const letterTextEl = document.getElementById('letter-text');
const heartsContainer = document.getElementById('hearts-container');
const promiseTempText = document.getElementById('promise-temp-text');
const promiseButtonsWrap = document.getElementById('promise-buttons');

const TOTAL_QUESTIONS = 3;
const MAX_NO_CLICKS = 3;
let noClickCount = 0;

// Pastel colors for confetti (match site theme)
const CONFETTI_COLORS = ['#ffd6e0', '#ffb3c6', '#e8d5f2', '#ffecd2', '#d4f1e8', '#f5d0e8', '#c9e4de'];

// ---------- 1. Disclaimer modal: must click to continue ----------
function initDisclaimer() {
  if (!disclaimerModal || !disclaimerBtn) return;
  disclaimerBtn.addEventListener('click', () => {
    disclaimerModal.classList.add('hidden');
    if (introOverlay) introOverlay.classList.remove('hidden');
  });
}

function initIntro() {
  if (!introOverlay || !introBtn) return;
  introBtn.addEventListener('click', () => {
    introOverlay.classList.add('hidden');
  });
}

// ---------- 2. Mini game: question flow ----------
let currentStep = 0; // 0 = Q1, 1 = Q2, 2 = Q3, 3 = transition, 4 = promise

function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'slide-out');
    if (i === index) card.classList.add('active');
  });
  if (progressText) {
    progressText.textContent = `Question ${index + 1} of ${TOTAL_QUESTIONS}`;
    progressText.style.visibility = 'visible';
  }
  transitionText.classList.remove('active');
  promiseCard.classList.remove('active');
}

function showTransition() {
  cards.forEach((c) => c.classList.remove('active'));
  if (progressText) progressText.style.visibility = 'hidden';
  transitionText.classList.add('active');
  promiseCard.classList.remove('active');
}

function showPromiseCard() {
  cards.forEach((c) => c.classList.remove('active'));
  transitionText.classList.remove('active');
  if (progressText) progressText.style.visibility = 'hidden';
  promiseCard.classList.add('active');
}

function goNext() {
  currentStep++;
  if (currentStep <= 2) {
    showCard(currentStep);
  } else if (currentStep === 3) {
    showTransition();
    setTimeout(() => {
      currentStep = 4;
      showPromiseCard();
    }, 2200);
  }
}

// ---------- Celebration: confetti + optional ding after each question ----------
function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
}

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const particleCount = 32;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
    const dist = 60 + Math.random() * 100;
    const endX = Math.cos(angle) * dist + (Math.random() - 0.5) * 80;
    const endY = Math.sin(angle) * dist + (Math.random() - 0.5) * 80;
    p.style.left = centerX + (Math.random() - 0.5) * 40 + 'px';
    p.style.top = centerY + (Math.random() - 0.5) * 40 + 'px';
    p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.width = (6 + Math.random() * 6) + 'px';
    p.style.height = p.style.width;
    p.style.setProperty('--confetti-end', `translate(${endX}px, ${endY}px)`);
    p.style.setProperty('--confetti-rotate', (Math.random() * 360 - 180) + 'deg');
    p.style.animationDelay = Math.random() * 0.1 + 's';
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1600);
}

function initGameCards() {
  cards.forEach((card) => {
    const buttons = card.querySelectorAll('.card-btn');
    buttons.forEach((btn) => {
      if (btn.id === 'yes-btn' || btn.id === 'no-btn') return;
      btn.addEventListener('click', () => {
        triggerConfetti();
        playDing();
        goNext();
      });
    });
  });
}

// ---------- 3. NO button: shrink over 3 clicks, show temp text, then disappear ----------
function initNoButton() {
  if (!noBtn || !yesBtn || !promiseCard || !promiseTempText || !promiseButtonsWrap) return;

  function showTempMessage(message) {
    promiseTempText.textContent = message;
    promiseTempText.classList.remove('fade-out');
    promiseTempText.classList.add('visible');
    // Stays visible until user clicks YES or NO again
  }

  function applyClickState(clickIndex) {
    noBtn.classList.remove('no-shrink-1', 'no-shrink-2', 'no-shrink-3');
    yesBtn.classList.remove('yes-grow-1', 'yes-grow-2', 'yes-grow-3');
    promiseButtonsWrap.classList.remove('yes-only');
    if (clickIndex >= 1) noBtn.classList.add('no-shrink-' + Math.min(clickIndex, 3));
    if (clickIndex >= 1) yesBtn.classList.add('yes-grow-' + Math.min(clickIndex, 3));
    if (clickIndex >= 3) promiseButtonsWrap.classList.add('yes-only');
  }

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (noClickCount >= MAX_NO_CLICKS) return;
    noClickCount++;
    applyClickState(noClickCount);
    const message = NO_CLICK_MESSAGES[noClickCount - 1] ?? "Say yes already~";
    showTempMessage(message);
  });
}

// ---------- 4. YES button: celebration then gifts ----------
function initYesButton() {
  const yesCelebration = document.getElementById('yes-celebration');
  if (!yesBtn || !gameContainer || !giftsSection) return;
  yesBtn.addEventListener('click', () => {
    // Clear temporary text when leaving promise card
    if (promiseTempText) {
      promiseTempText.textContent = '';
      promiseTempText.classList.remove('visible', 'fade-out');
    }
    gameContainer.classList.add('fade-out');
    setTimeout(() => {
      gameContainer.classList.add('hidden');
      if (yesCelebration) {
        yesCelebration.classList.remove('hidden');
        yesCelebration.style.display = 'flex';
      }
      // After ~1.5s, hide celebration and show gifts
      setTimeout(() => {
        if (yesCelebration) {
          yesCelebration.classList.add('hidden');
          yesCelebration.style.display = 'none';
        }
        giftsSection.classList.remove('hidden');
      }, 1500);
    }, 500);
  });
}

// ---------- 5. Gift cards: flip on click, open screen ----------
function initGiftCards() {
  giftCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.add('flipped');
      const giftNum = card.getAttribute('data-gift');
      const screen = document.getElementById(`gift-screen-${giftNum}`);
      if (screen) {
        screen.classList.remove('hidden');
        if (giftNum === '3') {
          startTypewriter();
          spawnHearts();
        }
      }
    });
  });
}

// ---------- 6. Gift screens: close button ----------
function initCloseGift() {
  closeGiftBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-close');
      const screen = document.getElementById(`gift-screen-${num}`);
      if (screen) {
        screen.classList.add('hidden');
      }
      if (num === '3') {
        stopHearts();
        if (typewriterTimeoutId) {
          clearTimeout(typewriterTimeoutId);
          typewriterTimeoutId = null;
        }
      }
      const card = document.querySelector(`.gift-card[data-gift="${num}"]`);
      if (card) card.classList.remove('flipped');
    });
  });
}

// ---------- 7. Gift 3: Typewriter effect for letter ----------
let typewriterTimeoutId = null;

function startTypewriter() {
  if (!letterTextEl) return;
  // Cancel any in-progress typewriter so we don't get mixed/wrong text
  if (typewriterTimeoutId) {
    clearTimeout(typewriterTimeoutId);
    typewriterTimeoutId = null;
  }
  letterTextEl.innerHTML = '';
  let i = 0;
  const text = LETTER_CONTENT;

  function type() {
    if (i < text.length) {
      if (text[i] === '\n') {
        letterTextEl.appendChild(document.createElement('br'));
      } else {
        letterTextEl.appendChild(document.createTextNode(text[i]));
      }
      i++;
      typewriterTimeoutId = setTimeout(type, 40);
    } else {
      typewriterTimeoutId = null;
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      letterTextEl.appendChild(cursor);
    }
  }
  type();
}

// ---------- 8. Gift 3: Floating hearts ----------
function spawnHearts() {
  if (!heartsContainer) return;
  heartsContainer.innerHTML = '';
  const hearts = ['💕', '💗', '❤️', '💖', '🌸'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = 3 + Math.random() * 4 + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }

  const intervalId = setInterval(createHeart, 600);
  heartsContainer._heartsInterval = intervalId;
}

// Clear hearts when closing gift 3 (optional)
function stopHearts() {
  if (heartsContainer && heartsContainer._heartsInterval) {
    clearInterval(heartsContainer._heartsInterval);
    heartsContainer._heartsInterval = null;
  }
}

// ---------- Replay letter (Gift 3) ----------
function initReplayLetter() {
  const replayBtn = document.getElementById('replay-letter-btn');
  if (!replayBtn || !letterTextEl) return;
  replayBtn.addEventListener('click', () => {
    startTypewriter();
  });
}

// ---------- Gift 3: Speaker – play Vaada.mp3 at low volume ----------
// Edit path if you move the file (e.g. 'audio/Vaada.mp3')
const LETTER_AUDIO_PATH = 'Vaada.mp3';
const LETTER_AUDIO_VOLUME = 0.28;

function initLetterAudio() {
  const btn = document.getElementById('letter-audio-btn');
  if (!btn) return;
  const audio = new Audio(LETTER_AUDIO_PATH);
  audio.volume = LETTER_AUDIO_VOLUME;

  btn.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

// ---------- Init ----------
function init() {
  initDisclaimer();
  initIntro();
  initGameCards();
  initNoButton();
  initYesButton();
  initGiftCards();
  initCloseGift();
  initReplayLetter();
  initLetterAudio();
  showCard(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
