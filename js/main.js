/* ════════════════════════════════════════════════════════
   main.js  —  Master Controller
   Handles:
     • smoothScrollTo()        helper used by CTA button
     • Scroll-triggered card animations (IntersectionObserver)
     • Staggered value-card entrance
     • Celebration scene  →  triggers confetti + fireworks
     • Finale scene       →  star canvas + floating hearts
   ════════════════════════════════════════════════════════ */


/* ── SMOOTH SCROLL HELPER ────────────────────────────────
   Called by the hero CTA button:
     onclick="smoothScrollTo('#timeline')"
──────────────────────────────────────────────────────── */
function smoothScrollTo(selector) {
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}


/* ════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — General scroll-in animations
   Watches: .timeline-item  .polaroid  .wish-card
   When any element enters the viewport it gets .visible
   which triggers its CSS transition (fade + slide).
   ════════════════════════════════════════════════════════ */
(function () {
  const generalObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.10 }  // trigger when 10 % of element is visible
  );

  document
    .querySelectorAll('.timeline-item, .polaroid, .wish-card')
    .forEach(el => generalObserver.observe(el));
})();


/* ════════════════════════════════════════════════════════
   STAGGERED VALUE CARDS
   Instead of all 6 cards popping in at once, they scale
   in one by one with a 100 ms gap between each card.
   ════════════════════════════════════════════════════════ */
(function () {
  const grid = document.querySelector('.values-grid');
  if (!grid) return;

  const staggerObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.value-card').forEach((card, index) => {
          setTimeout(() => card.classList.add('visible'), index * 100);
        });
        staggerObserver.disconnect(); // only animate once
      }
    },
    { threshold: 0.10 }
  );

  staggerObserver.observe(grid);
})();


/* ════════════════════════════════════════════════════════
   CELEBRATION SCENE  →  Confetti + Fireworks
   Fires once when #celebration scrolls 28 % into view.
   Stops automatically after 5.5 seconds.
   (startConfetti / startFireworks / stopConfetti / stopFireworks
    are defined in confetti.js)
   ════════════════════════════════════════════════════════ */
(function () {
  let fired = false;

  const celebObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;

        startConfetti();
        startFireworks();

        // Auto-stop after 5.5 s so it doesn't loop forever
        setTimeout(() => {
          stopConfetti();
          stopFireworks();
        }, 5500);

        celebObserver.disconnect();
      }
    },
    { threshold: 0.28 }
  );

  const cel = document.getElementById('celebration');
  if (cel) celebObserver.observe(cel);
})();


/* ════════════════════════════════════════════════════════
   FINALE SCENE  →  Reveal text + star canvas + hearts
   ════════════════════════════════════════════════════════ */
(function () {
  const finaleObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        // Stagger the four finale elements
        ['finale-heart', 'finale-title', 'finale-sub', 'finale-name'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('visible');
        });

        spawnHearts();    // floating emoji hearts
        startStarCanvas(); // twinkling star background

        finaleObserver.disconnect();
      }
    },
    { threshold: 0.18 }
  );

  const finale = document.getElementById('finale');
  if (finale) finaleObserver.observe(finale);
})();


/* ════════════════════════════════════════════════════════
   STAR CANVAS  —  Twinkling warm starfield for finale
   Draws stars that gently pulse (opacity sine wave).
   ════════════════════════════════════════════════════════ */
function startStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* Size the canvas to its parent section */
  const W = canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
  const H = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;

  /* Star colours — warm whites, rose-tints, gold-tints */
  const STAR_COLOURS = [
    'rgba(255,200,180,',
    'rgba(255,220,150,',
    'rgba(255,180,200,',
    'rgba(255,255,255,',
  ];

  /* Seed 140 stars with random positions, sizes, and twinkle phases */
  const stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x:      Math.random() * W,
      y:      Math.random() * H,
      r:      0.4 + Math.random() * 1.6,                  // radius 0.4 – 2 px
      alpha:  Math.random(),                               // base opacity
      dA:     0.006 + Math.random() * 0.012,              // twinkle speed
      phase:  Math.random() * Math.PI * 2,                // phase offset
      colour: STAR_COLOURS[Math.floor(Math.random() * STAR_COLOURS.length)],
    });
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      /* Sine wave gives a gentle pulse rather than a flat brightness */
      const a = (0.45 + 0.55 * Math.sin(t * s.dA * 60 + s.phase));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.colour + (a * s.alpha + 0.05) + ')';
      ctx.fill();
    });

    t += 0.016;
    requestAnimationFrame(draw);
  }

  draw();
}


/* ════════════════════════════════════════════════════════
   FLOATING HEARTS  —  Emoji particles for finale
   Spawns 35 heart/sparkle emojis that float upward and fade.
   ════════════════════════════════════════════════════════ */
function spawnHearts() {
  const EMOJIS = ['💛', '🧡', '💗', '💕', '✨', '🌸', '💫', '🌟', '💝'];

  let count = 0;

  const interval = setInterval(() => {
    if (count++ > 35) {
      clearInterval(interval);
      return;
    }

    const el = document.createElement('div');
    el.className   = 'heart-particle';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    /* Random position across the lower portion of the viewport */
    el.style.cssText = `
      left:               ${8 + Math.random() * 84}%;
      bottom:             ${8 + Math.random() * 35}%;
      animation-duration: ${2.2 + Math.random() * 2.5}s;
      animation-delay:    ${Math.random() * 0.6}s;
    `;

    document.body.appendChild(el);

    // Clean up from DOM after animation completes
    setTimeout(() => el.remove(), 5000);

  }, 150); // spawn one every 150 ms
}