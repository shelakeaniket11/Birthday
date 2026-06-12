/* ════════════════════════════════════════════════════════
   gallery.js  —  Photo Stack (Polaroid Swipe Deck)
   ════════════════════════════════════════════════════════

   HOW TO ADD YOUR PHOTOS
   ──────────────────────
   1.  Drop your photos into the  /images/  folder.
   2.  Name them:  1.jpg  2.jpg  3.jpg  ...  (or .png)
   3.  Edit the PHOTOS array below:
         src     → path to the image  (always starts with "images/")
         caption → the text shown below the photo on the polaroid
   4.  Save and open index.html — that's it!

   PHOTO SIZE TIPS
   ───────────────
   • Best: 800 × 800 px (square)  or  800 × 1000 px (portrait)
   • Keep each file under 300 KB — use https://squoosh.app to compress
   • Landscape photos will be cropped — prefer square/portrait

   ════════════════════════════════════════════════════════ */


/* ── ✏️ EDIT THIS ARRAY ──────────────────────────────────
   Add one object per photo.
   You can have as many photos as you want.
   The deck shows them from LAST to FIRST
   (bottom of array = first card shown on top).
──────────────────────────────────────────────────────── */
const PHOTOS = [
  {
    src:     'images/1.png',
    caption: 'Lucky to have a friend like you 🤍'   // ✏️ Change this caption
  },
  {
    src:     'images/2.png',
    caption: 'Cheers to countless memories and many more ahead'
  },
  {
    src:     'images/3.png',
    caption: 'A true friend is lifes greatest blessing'
  },
  {
    src:     'images/4.png',
    caption: 'Friendship > everything else'
  },
  {
    src:     'images/5.png',
    caption: 'Some bonds are too special for words'
  },
];


/* ════════════════════════════════════════════════════════
   STACK ENGINE  —  you don't need to edit below this line
   ════════════════════════════════════════════════════════ */

// How much each card is rotated from the one below it (degrees).
// Cards alternate left/right so the stack looks natural.
const BASE_ROTATIONS = [-4, 3, -2, 4, -3, 2, -5, 3];

// How much each card is offset in x/y so they look stacked, not perfectly aligned.
const OFFSETS = [
  { x:  0, y: 0 },
  { x:  3, y: 2 },
  { x: -3, y: 3 },
  { x:  4, y: 1 },
  { x: -2, y: 4 },
];

let stackCards = [];  // holds references to the DOM card elements currently in the stack
let topIndex   = 0;   // index into stackCards — which card is currently on top


/* buildStack()
   ─────────────
   Called once on page load, and again when the Replay button is pressed.
   Creates all card DOM nodes and stacks them inside #photo-stack.
*/
function buildStack() {
  const stack   = document.getElementById('photo-stack');
  const hint    = document.getElementById('stack-hint');
  const replay  = document.getElementById('stack-replay');

  // Clear any existing cards
  stack.innerHTML = '';
  stackCards = [];
  topIndex   = 0;

  // Hide replay button, show hint
  replay.style.display = 'none';
  hint.style.display   = 'block';

  // Build cards — last photo in array = bottom of deck (z-index: 1)
  // first photo in array = top of deck (z-index: PHOTOS.length)
  PHOTOS.forEach((photo, i) => {
    const card = document.createElement('div');
    card.className = 'stack-card';

    // z-index: first photo (i=0) gets highest z-index → appears on top
    card.style.zIndex = PHOTOS.length - i;

    // Slight random rotation so cards look hand-placed, not perfectly aligned
    const rot    = BASE_ROTATIONS[i % BASE_ROTATIONS.length];
    const offset = OFFSETS[i % OFFSETS.length];
    card.style.transform = `rotate(${rot}deg) translate(${offset.x}px, ${offset.y}px)`;

    // Delay card appearance for a satisfying "deal" effect
    card.style.animationDelay = `${i * 80}ms`;

    // Photo area
    const photoDiv = document.createElement('div');
    photoDiv.className = 'card-photo';

    const img = document.createElement('img');
    img.src   = photo.src;
    img.alt   = photo.caption;
    // If image fails to load, show a warm gradient placeholder
    img.onerror = () => {
      photoDiv.style.background = 'linear-gradient(135deg, #ffe4ec, #ffd6b8, #f0d4ff)';
      img.style.display = 'none';
    };
    photoDiv.appendChild(img);

    // Caption strip
    const caption = document.createElement('p');
    caption.className   = 'card-caption';
    caption.textContent = photo.caption;

    card.appendChild(photoDiv);
    card.appendChild(caption);

    // Tap / click handler — dismiss top card
    card.addEventListener('click', () => dismissTopCard());
    // Touch swipe support (swipe left or right)
    addSwipeSupport(card);

    stack.appendChild(card);
    stackCards.push(card);
  });

  // Mark the first card (top of deck) as active
  updateTopCard();
}


/* updateTopCard()
   ───────────────
   Marks the current top card with the .is-top class so CSS can
   apply the floating animation to it.
*/
function updateTopCard() {
  stackCards.forEach((c, i) => {
    c.classList.toggle('is-top', i === topIndex);
  });
}


/* dismissTopCard()
   ─────────────────
   Flings the current top card off-screen (left or right, randomly),
   then promotes the next card to the top position.
*/
function dismissTopCard() {
  if (topIndex >= stackCards.length) return; // no cards left

  const card      = stackCards[topIndex];
  const direction = Math.random() > 0.5 ? 'fly-right' : 'fly-left';

  // Add fly class → CSS transition handles the animation
  card.classList.add(direction);

  // After animation ends, fully hide the card and advance the index
  card.addEventListener('transitionend', () => {
    card.style.visibility = 'hidden';
    topIndex++;
    updateTopCard();
    checkIfEmpty();
  }, { once: true });
}


/* checkIfEmpty()
   ───────────────
   When all cards have been dismissed, shows the replay button.
*/
function checkIfEmpty() {
  const hint   = document.getElementById('stack-hint');
  const replay = document.getElementById('stack-replay');

  if (topIndex >= stackCards.length) {
    hint.style.display   = 'none';
    replay.style.display = 'block';
  }
}


/* addSwipeSupport(card)
   ──────────────────────
   Adds touch event listeners so the user can swipe a card away
   on mobile. Tracks the horizontal distance of the swipe and,
   if > 40 px, dismisses the top card.
*/
function addSwipeSupport(card) {
  let startX = null;

  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  card.addEventListener('touchend', e => {
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 40) {
      dismissTopCard();
    }
    startX = null;
  }, { passive: true });
}


/* ── Auto-build the stack when the DOM is ready ─────── */
document.addEventListener('DOMContentLoaded', buildStack);