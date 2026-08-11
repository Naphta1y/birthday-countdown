document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     AMBIENT FLOATING PETALS — more variety, better sway
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
     ENHANCEMENT 2 + 3: TYPEWRITER EFFECT FOR THE SUBTITLE
     Types phrases one character at a time, then erases them,
     cycling through a loop. Paired with the CSS blinking cursor.
     ============================================================ */
  const pageSub = document.querySelector('.page-sub');
  const phrases = [
    'The countdown has begun…',
    'Something wonderful is coming…',
    'August 11th is almost here…'
  ];

  if (pageSub && !reduceMotion) {
    let phraseIndex  = 0;
    let charIndex    = 0;
    let isDeleting   = false;
    let typeTimeout;

    function typeLoop() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        pageSub.textContent = current.slice(0, charIndex);
      } else {
        charIndex++;
        pageSub.textContent = current.slice(0, charIndex);
      }

      let delay = isDeleting ? 45 : 80;

      if (!isDeleting && charIndex === current.length) {
        // Finished typing — pause, then erase
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished erasing — next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      typeTimeout = setTimeout(typeLoop, delay);
    }

    // Start after a short delay so the page has settled
    setTimeout(typeLoop, 900);
  } else if (pageSub) {
    // No animation — just show the first phrase statically
    pageSub.textContent = phrases[0];
  }

  /* ============================================================
     ENHANCEMENT 4: SCROLL-TRIGGERED FADE-IN WITH
     IntersectionObserver — elements with class "reveal" fade in
     only when they scroll into view.
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target); // fire once
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============================================================
     ENHANCEMENT 5: SPARKLE CURSOR TRAIL
     On mousemove, sparkle emojis briefly appear at the cursor
     and fade out. Skipped entirely when reduceMotion is true.
     ============================================================ */
  if (!reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.35) return; // fire ~65% of moves
      const spark = document.createElement('span');
      spark.textContent = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
      spark.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        left:${e.clientX - 8}px; top:${e.clientY - 8}px;
        font-size:${0.8 + Math.random() * 0.6}rem;
        animation: sparkFade 0.7s ease forwards;
        user-select:none;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    });
  }

  /* ============================================================
     ENHANCEMENT 6: SMOOTH 3D CARD TILT ON MOUSE HOVER
     Glassmorphism countdown cards subtly tilt in 3D towards
     the cursor — holographic card effect on desktop.
     ============================================================ */
  if (!reduceMotion) {
    document.querySelectorAll('.count-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale(1.04)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     TARGET DATE — midnight, 11th August, UTC+0
     (Ghana is UTC+0, so this is correct for Nora's timezone.)
     ============================================================ */
  const TARGET_DATE = new Date('2026-08-11T00:00:00+00:00');

  /* ============================================================
     PROGRESS BAR — from a "start" reference to the birthday
     ============================================================ */
  const PROGRESS_START = new Date(TARGET_DATE.getTime() - 30 * 24 * 60 * 60 * 1000);
  const progressFill   = document.getElementById('progressFill');
  const progressLabel  = document.getElementById('progressLabel');

  /* ENHANCEMENT 7: PROGRESS BAR ENTRANCE ANIMATION
     On first run, the bar starts at 0% then smoothly fills to
     the real percentage over 1.5 seconds — satisfying opening moment.
     ============================================================ */
  let firstRun = true;

  function updateProgress() {
    const now     = Date.now();
    const total   = TARGET_DATE - PROGRESS_START;
    const elapsed = now - PROGRESS_START;
    const pct     = Math.min(100, Math.max(0, (elapsed / total) * 100));

    if (progressLabel) progressLabel.textContent = `${Math.floor(pct)}% there ✨`;

    if (firstRun) {
      // Start at zero, then animate to real value
      if (progressFill) progressFill.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (progressFill) {
            progressFill.style.transition = 'width 1.5s cubic-bezier(.4,0,.2,1)';
            progressFill.style.width = `${pct.toFixed(2)}%`;
          }
        }, 400);
      });
      firstRun = false;
    } else {
      if (progressFill) progressFill.style.width = `${pct.toFixed(2)}%`;
    }
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
     ENHANCEMENT 11: FIREWORKS ON BIRTHDAY DAY
     A sustained fireworks loop fires alongside confetti.
     ============================================================ */
  function launchFireworks(duration = 8000) {
    if (reduceMotion || typeof confetti !== 'function') return;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 };

    function fire() {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;
      const count = 55 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount: count,
        colors: PALETTE,
        shapes: ['star', 'circle'],
        origin: { x: Math.random() * 0.7 + 0.15, y: Math.random() * 0.4 + 0.1 }
      }));
      setTimeout(fire, 400);
    }

    fire();
  }

  /* ============================================================
     CELEBRATION — confetti + flip cards + fireworks
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

    // Fire initial confetti bursts
    if (!reduceMotion && typeof confetti === 'function') {
      confetti({ particleCount: 180, spread: 130, startVelocity: 50, origin: { y: 0.55 }, colors: PALETTE });
      setTimeout(() => confetti({ particleCount: 120, spread: 110, origin: { x: 0.15, y: 0.6 }, colors: PALETTE }), 350);
      setTimeout(() => confetti({ particleCount: 120, spread: 110, origin: { x: 0.85, y: 0.6 }, colors: PALETTE }), 600);
      setTimeout(() => confetti({ particleCount: 80,  spread: 90,  origin: { x: 0.5,  y: 0.3 }, colors: PALETTE, shapes: ['star'] }), 900);

      // ENHANCEMENT 11: sustained fireworks loop after initial bursts
      setTimeout(() => launchFireworks(8000), 1200);
    }
  }

  /* ============================================================
     TICK — runs every second
     ============================================================ */
  let timer;

  function tick() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    updateProgress();

    if (diff <= 0) {
      if (!hasCelebrated) {
        hasCelebrated = true;
        celebrate();
      }
      // ENHANCEMENT 10: update browser tab title on birthday
      document.title = "🎉 It's Today! Happy Birthday, Nora!";
      if (timer) {
        clearInterval(timer);
      }
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

    // ENHANCEMENT 10: dynamic browser tab title with live countdown
    document.title = `${days}d ${hours}h — Nora's Birthday 🎂`;
  }

  tick();
  timer = setInterval(tick, 1000);

  /* ============================================================
     MUSIC TOGGLE + AUTOPLAY ON LOAD
     ENHANCEMENT 8: Toggle 'playing' class for ripple ring
     ============================================================ */
  const musicBtn  = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const bgMusic   = document.getElementById('bgMusic');
  let   playing   = false;

  function setPlayingState(isPlaying) {
    playing = isPlaying;
    if (musicIcon) musicIcon.textContent = isPlaying ? '🎵' : '🔇';
    // ENHANCEMENT 8: toggle 'playing' class for the ripple ring animation
    if (musicBtn) {
      if (isPlaying) {
        musicBtn.classList.add('playing');
      } else {
        musicBtn.classList.remove('playing');
      }
    }
  }

  function startMusic() {
    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      setPlayingState(true);
    }).catch(() => {
      // Autoplay blocked by browser — user must interact first
      setPlayingState(false);
    });
  }

  // Attempt autoplay as soon as the page loads
  if (bgMusic) {
    startMusic();
  }

  // Button lets user manually toggle at any time
  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (playing) {
        bgMusic.pause();
        setPlayingState(false);
      } else {
        bgMusic.volume = 0.35;
        bgMusic.play().then(() => {
          setPlayingState(true);
        }).catch(() => {});
      }
    });
  }

  /* ============================================================
     ENHANCEMENT 12: KEYBOARD EASTER EGG
     If Nora types "NORA" on her keyboard, a mini confetti
     burst fires — a hidden magical surprise.
     ============================================================ */
  let keyBuffer = '';
  document.addEventListener('keydown', (e) => {
    keyBuffer += e.key.toUpperCase();
    keyBuffer = keyBuffer.slice(-4); // keep only the last 4 characters

    if (keyBuffer === 'NORA') {
      if (!reduceMotion) {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: PALETTE
        });
        confetti({
          particleCount: 60,
          spread: 80,
          startVelocity: 25,
          origin: { x: 0.2, y: 0.6 },
          colors: PALETTE,
          shapes: ['star']
        });
        confetti({
          particleCount: 60,
          spread: 80,
          startVelocity: 25,
          origin: { x: 0.8, y: 0.6 },
          colors: PALETTE,
          shapes: ['star']
        });
      }

      // Show a sweet toast message
      const toast = document.createElement('div');
      toast.textContent = '💛 Hi Nora! You found the secret!';
      toast.style.cssText = `
        position: fixed;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,255,255,0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,0.7);
        border-radius: 999px;
        padding: 0.7rem 1.6rem;
        font-family: 'Jost', sans-serif;
        font-size: 0.95rem;
        color: #C06478;
        font-weight: 500;
        letter-spacing: 0.04em;
        box-shadow: 0 8px 30px rgba(61,26,52,0.15);
        z-index: 9999;
        animation: sparkFade 3.5s ease forwards;
        pointer-events: none;
        white-space: nowrap;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);

      keyBuffer = ''; // reset so she can trigger it again
    }
  });
});
