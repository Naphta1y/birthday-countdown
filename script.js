document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ambient floating petals ---------- */
  if (!reduceMotion) {
    const petalContainer = document.getElementById('petals');
    const petalSymbols = ['🌸', '🌷', '✨'];
    const PETAL_COUNT = 14;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${10 + Math.random() * 12}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petalContainer.appendChild(petal);
    }
  }

  /* ---------- Target date: midnight, 11th August, Ghana Time (UTC+0) ---------- */
  // Edit the year below if you're reusing this page for a future birthday.
  // To target a specific hour instead of midnight, change T00:00:00 to e.g. T14:30:00.
  const TARGET_DATE = new Date('2026-08-11T00:00:00+00:00');

  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minutesEl = document.getElementById('minutesVal');
  const secondsEl = document.getElementById('secondsVal');
  const countdownGrid = document.getElementById('countdownGrid');
  const celebrationState = document.getElementById('celebrationState');

  let previousValues = { days: null, hours: null, minutes: null, seconds: null };
  let hasCelebrated = false;

  const PALETTE = ['#D88C9A', '#C06478', '#C9A227', '#B9A6DC', '#FFF6F0'];

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function popAnimation(el) {
    if (reduceMotion) return;
    el.style.animation = 'none';
    // force reflow so the animation can retrigger
    void el.offsetWidth;
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

  function celebrate() {
    countdownGrid.style.display = 'none';
    document.querySelector('.target-date').style.display = 'none';
    celebrationState.classList.add('active');
    celebrationState.setAttribute('aria-hidden', 'false');

    if (!reduceMotion) {
      confetti({ particleCount: 150, spread: 120, startVelocity: 45, origin: { y: 0.6 }, colors: PALETTE });
      setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { x: 0.2 }, colors: PALETTE }), 300);
      setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { x: 0.8 }, colors: PALETTE }), 500);
    }
  }

  function tick() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if (!hasCelebrated) {
        hasCelebrated = true;
        celebrate();
      }
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateUnit(daysEl, days, 'days');
    updateUnit(hoursEl, hours, 'hours');
    updateUnit(minutesEl, minutes, 'minutes');
    updateUnit(secondsEl, seconds, 'seconds');
  }

  tick();
  const timer = setInterval(tick, 1000);
});