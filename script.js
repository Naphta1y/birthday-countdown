document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     5. AMBIENT FLOATING PETALS — more variety, better sway
     ============================================================ */
  if (!reduceMotion) {
    const petalContainer = document.getElementById('petals');
    const petalSymbols   = ['🌸', '🌷', '✨', '🎀', '💕', '🌺', '🌼', '💫'];
    const PETAL_COUNT    = 22;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('span');
      petal.className   = 'petal';
      petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
      petal.style.left             = `${Math.random() * 100}vw`;
      petal.style.fontSize         = `${0.9 + Math.random() * 1.0}rem`;
      petal.style.animationDuration  = `${11 + Math.random() * 13}s`;
      petal.style.animationDelay     = `${Math.random() * 12}s`;
      petalContainer.appendChild(petal);
    }
  }

  /* ============================================================
     TARGET DATE — midnight, 11th August, UTC+0
     ============================================================ */
  const TARGET_DATE = new Date('2026-08-11T00:00:00+00:00');

  /* ============================================================
     6. PROGRESS BAR — from a "start" reference to the birthday
     ============================================================ */
  // Start reference: 30 days before the birthday feels natural
  const PROGRESS_START = new Date(TARGET_DATE.getTime() - 30 * 24 * 60 * 60 * 1000);
  const progressFill   = document.getElementById('progressFill');
  const progressLabel  = document.getElementById('progressLabel');

  function updateProgress() {
    const now      = Date.now();
    const total    = TARGET_DATE - PROGRESS_START;
    const elapsed  = now - PROGRESS_START;
    const pct      = Math.min(100, Math.max(0, (elapsed / total) * 100));
    if (progressFill)  progressFill.style.width = `${pct.toFixed(2)}%`;
    if (progressLabel) progressLabel.textContent = `${Math.floor(pct)}% there ✨`;
  }
  updateProgress();

  /* ============================================================
     COUNTDOWN ELEMENTS
     ============================================================ */
  const daysEl      = document.getElementById('daysVal');
  const hoursEl     = document.getElementById('hoursVal');
  const minutesEl   = document.getElementById('minutesVal');
  const secondsEl   = document.getElementById('secondsVal');
  const countdownGrid    = document.getElementById('countdownGrid');
  const celebrationState = document.getElementById('celebrationState');

  let previousValues = { days: null, hours: null, minutes: null, seconds: null };
  let hasCelebrated  = false;

  const PALETTE = ['#D88C9A', '#C06478', '#C9A227', '#B9A6DC', '#FFF6F0'];

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function popAnimation(el) {
    if (reduceMotion) return;
    el.style.animation = 'none';
    void el.offsetWidth; // force reflow
    el.style.animation = '';
  }

  function updateUnit(el, value, key) {
    const padded = pad(value);
    if (previousValues[key] !== padded) {
      el.textContent = padded;
      popAnimation(el);
      previousValues[key] = padded;
    }
  }

  /* ============================================================
     10. CELEBRATION — confetti + flip cards
     ============================================================ */
  function celebrate() {
    // Hide countdown elements
    countdownGrid.style.display = 'none';
    const targetDate = document.querySelector('.target-date');
    if (targetDate) targetDate.style.display = 'none';
    const loveNote = document.getElementById('loveNote');
    if (loveNote) loveNote.style.display = 'none';

    // Show celebration section
    celebrationState.classList.add('active');
    celebrationState.setAttribute('aria-hidden', 'false');

    // Fire confetti
    if (!reduceMotion) {
      confetti({ particleCount: 180, spread: 130, startVelocity: 50, origin: { y: 0.55 }, colors: PALETTE });
      setTimeout(() => confetti({ particleCount: 120, spread: 110, origin: { x: 0.15, y: 0.6 }, colors: PALETTE }), 350);
      setTimeout(() => confetti({ particleCount: 120, spread: 110, origin: { x: 0.85, y: 0.6 }, colors: PALETTE }), 600);
      setTimeout(() => confetti({ particleCount: 80,  spread: 90,  origin: { x: 0.5,  y: 0.3 }, colors: PALETTE, shapes: ['star'] }), 900);
    }
  }

  /* ============================================================
     TICK — runs every second
     ============================================================ */
  function tick() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    updateProgress();

    if (diff <= 0) {
      if (!hasCelebrated) {
        hasCelebrated = true;
        celebrate();
      }
      clearInterval(timer);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateUnit(daysEl,    days,    'days');
    updateUnit(hoursEl,   hours,   'hours');
    updateUnit(minutesEl, minutes, 'minutes');
    updateUnit(secondsEl, seconds, 'seconds');
  }

  tick();
  const timer = setInterval(tick, 1000);

  /* ============================================================
     9. MUSIC TOGGLE
     ============================================================ */
  const musicBtn  = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const bgMusic   = document.getElementById('bgMusic');
  let   playing   = false;

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (playing) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
      } else {
        bgMusic.volume = 0.35;
        bgMusic.play().catch(() => {
          // Autoplay blocked — silently ignore; user can retry
        });
        musicIcon.textContent = '🎵';
      }
      playing = !playing;
    });
  }
});