/* ════════════════════════════════════════════════════════
   particles.js  —  Warm Floating Background Particles
   Draws soft rose/amber/lilac dots on the fixed canvas
   that sits behind all page content.
   ════════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H;
  let particles = [];

  /* Warm colour palette — all rgba prefix strings */
  const COLOURS = [
    'rgba(255,107,138,',   // rose
    'rgba(247,166,69,',    // amber
    'rgba(232,180,248,',   // lilac
    'rgba(255,200,130,',   // peach
    'rgba(255,160,170,',   // soft rose
    'rgba(245,200,66,',    // gold
  ];

  /* Resize canvas to fill the viewport */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Create a single particle with random properties */
  function makeParticle() {
    return {
      x:            Math.random() * W,
      y:            Math.random() * H + H * 0.2,  // start in lower 80 % of screen
      r:            Math.random() * 2.2 + 0.4,    // radius 0.4 – 2.6 px
      vx:           (Math.random() - 0.5) * 0.25, // gentle drift left/right
      vy:           -(Math.random() * 0.45 + 0.1),// slow upward float
      alpha:        Math.random() * 0.55 + 0.15,  // base opacity
      colour:       COLOURS[Math.floor(Math.random() * COLOURS.length)],
      twinkle:      Math.random() * Math.PI * 2,  // phase offset for twinkle
      twinkleSpeed: Math.random() * 0.04 + 0.01,  // how fast it twinkles
    };
  }

  /* Seed the field */
  for (let i = 0; i < 90; i++) particles.push(makeParticle());

  /* Animation loop */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Twinkle: alpha oscillates gently around its base value
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.colour + a + ')';
      ctx.fill();

      // Move particle
      p.x       += p.vx;
      p.y       += p.vy;
      p.twinkle += p.twinkleSpeed;
      p.alpha   -= 0.0005; // very slow fade-out

      // When particle drifts off-screen or fades out, recycle it
      if (p.y < -10 || p.alpha <= 0.05) {
        Object.assign(p, makeParticle(), { y: H + 10 });
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();