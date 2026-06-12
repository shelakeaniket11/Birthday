/* ════════════════════════════════════════════════════════
   balloons.js  —  Floating Balloons in Hero Section
   Creates colourful balloon DOM elements and injects them
   into #balloon-container so they float upward endlessly.
   ════════════════════════════════════════════════════════ */

(function () {

  /* Each balloon definition:
     c  = main body colour
     sc = shadow / darker side colour (for the radial-gradient illusion of depth) */
  const BALLOON_DEFS = [
    { c: '#ff6b8a', sc: '#e8335a' },  // rose
    { c: '#f7a645', sc: '#e07a20' },  // amber
    { c: '#e8b4f8', sc: '#b060e0' },  // lilac
    { c: '#ffc870', sc: '#e09020' },  // gold
    { c: '#ff9ab0', sc: '#d05070' },  // soft pink
    { c: '#ffd080', sc: '#e0a020' },  // warm yellow
    { c: '#d4a0ff', sc: '#9050d0' },  // lavender
    { c: '#ffb8c8', sc: '#d07090' },  // blush
  ];

  const TOTAL_BALLOONS = 14;

  const container = document.getElementById('balloon-container');
  if (!container) return; // safety check

  for (let i = 0; i < TOTAL_BALLOONS; i++) {
    const def = BALLOON_DEFS[i % BALLOON_DEFS.length];

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    /* Randomise size, position, speed, and delay so balloons
       feel organic — not like a marching row */
    const width    = 28 + Math.random() * 16;          // 28 – 44 px wide
    const height   = width * 1.3;                       // taller than wide (balloon shape)
    const leftPct  = 4 + Math.random() * 92;            // 4 % – 96 % from left edge
    const opacity  = 0.55 + Math.random() * 0.45;       // 0.55 – 1.0
    const duration = 7 + Math.random() * 9;             // 7 – 16 s per cycle
    const delay    = -(Math.random() * 12);              // negative delay = already mid-flight on load

    balloon.style.cssText = `
      left:               ${leftPct}%;
      width:              ${width}px;
      height:             ${height}px;
      background:         radial-gradient(circle at 35% 30%, ${def.c}, ${def.sc});
      color:              ${def.c};
      opacity:            ${opacity};
      animation-duration: ${duration}s;
      animation-delay:    ${delay}s;
    `;

    container.appendChild(balloon);
  }

})();