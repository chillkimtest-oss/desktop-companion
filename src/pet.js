const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

// --- Sprites ---
const SPRITES = {
  idle: 'sprites/sprite-idle-128.png',
  'idle-blink': 'sprites/sprite-idle-blink-128.png',
  happy: 'sprites/sprite-happy-128.png',
  sad: 'sprites/sprite-sad-128.png',
  angry: 'sprites/sprite-angry-128.png',
  love: 'sprites/sprite-love-128.png',
  cool: 'sprites/sprite-cool-128.png',
  surprised: 'sprites/sprite-surprised-128.png',
  excited: 'sprites/sprite-excited-128.png',
  thinking: 'sprites/sprite-thinking-128.png',
  sleeping: 'sprites/sprite-sleeping-128.png',
  typing: 'sprites/sprite-typing-128.png',
  eating: 'sprites/sprite-eating-128.png',
  waving: 'sprites/sprite-waving-128.png',
  walking: 'sprites/sprite-walking-128.png',
  stargazing: 'sprites/sprite-stargazing-128.png',
};

// Preload all sprites
Object.values(SPRITES).forEach(src => {
  const img = new Image();
  img.src = src;
});

// --- DOM ---
const spriteEl = document.getElementById('pet-sprite');
const containerEl = document.getElementById('pet-container');
const zzzEl = document.getElementById('zzz');

// --- State Machine ---
const STATES = {
  IDLE: 'idle',
  WALKING: 'walking',
  SLEEPING: 'sleeping',
  TYPING: 'typing',
  THINKING: 'thinking',
  EATING: 'eating',
  HAPPY: 'happy',
  EXCITED: 'excited',
  STARGAZING: 'stargazing',
  REACTING: 'reacting', // click reactions
};

let currentState = STATES.IDLE;
let previousState = STATES.IDLE;
let stateStartTime = Date.now();
let idleSinceTime = Date.now();
let forceSleep = false;

// Walking state
let petX = 0;
let screenWidth = 1920;
let screenHeight = 1080;
let walkDirection = 1; // 1 = right, -1 = left
const WALK_SPEED = 1.5; // pixels per tick
const WINDOW_SIZE = 200;
const SPRITE_SIZE = 128;
const PET_PADDING = 36; // padding around sprite in window

// Click reactions
const CLICK_REACTIONS = ['love', 'cool', 'surprised', 'waving'];
let clickReactionIndex = 0;

// Blink timer
let blinkTimer = null;
let isBlinking = false;

// --- Initialize ---
async function init() {
  try {
    const [sw, sh] = await invoke('get_screen_size');
    screenWidth = sw;
    screenHeight = sh;
    petX = screenWidth / 2 - WINDOW_SIZE / 2;
    await invoke('set_position', { x: petX, y: screenHeight - WINDOW_SIZE });
  } catch (e) {
    console.error('Failed to get screen size:', e);
  }

  // Listen for tray events
  listen('tray-toggle-sleep', () => {
    forceSleep = !forceSleep;
    if (forceSleep) {
      changeState(STATES.SLEEPING);
    } else {
      changeState(STATES.IDLE);
    }
  });

  listen('tray-about', () => {
    // Show happy face briefly as acknowledgment
    if (currentState !== STATES.SLEEPING || !forceSleep) {
      triggerReaction('happy');
    }
  });

  // Start blink cycle
  scheduleBlink();

  // Start main loop
  setInterval(tick, 50); // 20 FPS

  // Start autonomous behavior
  scheduleNextBehavior();

  // Click interaction
  containerEl.addEventListener('mousedown', onPetClick);

  // Handle mouse enter/leave for click-through
  containerEl.addEventListener('mouseenter', () => {
    invoke('set_ignore_cursor_events', { ignore: false });
  });

  // Detect mouse leaving pet area to re-enable click-through
  document.addEventListener('mousemove', (e) => {
    const rect = containerEl.getBoundingClientRect();
    const inBounds =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inBounds) {
      invoke('set_ignore_cursor_events', { ignore: true });
    }
  });

  // Start with click-through enabled (transparent areas pass through)
  invoke('set_ignore_cursor_events', { ignore: true });
}

// --- Sprite Management ---
function setSprite(name) {
  if (SPRITES[name] && spriteEl.src !== SPRITES[name]) {
    spriteEl.src = SPRITES[name];
  }
  // Flip sprite when walking left
  if (name === 'walking' && walkDirection === -1) {
    spriteEl.style.transform = 'scaleX(-1)';
  } else {
    spriteEl.style.transform = 'scaleX(1)';
  }
}

// --- State Changes ---
function changeState(newState) {
  if (newState === currentState) return;
  previousState = currentState;
  currentState = newState;
  stateStartTime = Date.now();

  // Update ZZZ visibility
  zzzEl.classList.toggle('visible', newState === STATES.SLEEPING);

  // Set appropriate sprite
  switch (newState) {
    case STATES.IDLE:
      setSprite('idle');
      idleSinceTime = Date.now();
      break;
    case STATES.WALKING:
      setSprite('walking');
      walkDirection = Math.random() > 0.5 ? 1 : -1;
      break;
    case STATES.SLEEPING:
      setSprite('sleeping');
      break;
    case STATES.TYPING:
      setSprite('typing');
      break;
    case STATES.THINKING:
      setSprite('thinking');
      break;
    case STATES.EATING:
      setSprite('eating');
      break;
    case STATES.HAPPY:
      setSprite('happy');
      break;
    case STATES.EXCITED:
      setSprite('excited');
      break;
    case STATES.STARGAZING:
      setSprite('stargazing');
      break;
  }
}

function triggerReaction(spriteName) {
  const prevState = currentState;
  currentState = STATES.REACTING;
  setSprite(spriteName);
  setTimeout(() => {
    if (currentState === STATES.REACTING) {
      currentState = STATES.IDLE;
      setSprite('idle');
      scheduleNextBehavior();
    }
  }, 2000);
}

// --- Click Handler ---
function onPetClick(e) {
  e.preventDefault();
  if (forceSleep) return;

  const reaction = CLICK_REACTIONS[clickReactionIndex];
  clickReactionIndex = (clickReactionIndex + 1) % CLICK_REACTIONS.length;
  triggerReaction(reaction);
}

// --- Blink ---
function scheduleBlink() {
  const delay = 2000 + Math.random() * 5000; // 2-7 seconds
  blinkTimer = setTimeout(() => {
    if (currentState === STATES.IDLE && !isBlinking) {
      isBlinking = true;
      setSprite('idle-blink');
      setTimeout(() => {
        if (currentState === STATES.IDLE) {
          setSprite('idle');
        }
        isBlinking = false;
      }, 150 + Math.random() * 100);
    }
    scheduleBlink();
  }, delay);
}

// --- Autonomous Behavior ---
function scheduleNextBehavior() {
  const delay = 8000 + Math.random() * 15000; // 8-23 seconds between behaviors
  setTimeout(() => {
    if (currentState === STATES.REACTING || forceSleep) {
      scheduleNextBehavior();
      return;
    }
    pickRandomBehavior();
  }, delay);
}

function pickRandomBehavior() {
  // Check for sleep (5 min idle)
  if (Date.now() - idleSinceTime > 5 * 60 * 1000 && currentState === STATES.IDLE) {
    changeState(STATES.SLEEPING);
    // Wake up after 30-60 seconds
    setTimeout(() => {
      if (currentState === STATES.SLEEPING && !forceSleep) {
        changeState(STATES.IDLE);
        scheduleNextBehavior();
      }
    }, 30000 + Math.random() * 30000);
    return;
  }

  // Check for stargazing (nighttime: 9 PM - 5 AM)
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 5;

  // Weighted random behavior selection
  const behaviors = [
    { state: STATES.WALKING, weight: 30, duration: [5000, 12000] },
    { state: STATES.THINKING, weight: 15, duration: [3000, 6000] },
    { state: STATES.EATING, weight: 12, duration: [3000, 5000] },
    { state: STATES.HAPPY, weight: 10, duration: [2000, 4000] },
    { state: STATES.EXCITED, weight: 8, duration: [2000, 3500] },
    { state: STATES.TYPING, weight: 10, duration: [4000, 8000] },
    { state: STATES.IDLE, weight: 15, duration: [3000, 8000] },
  ];

  if (isNight) {
    behaviors.push({ state: STATES.STARGAZING, weight: 20, duration: [5000, 10000] });
  }

  const totalWeight = behaviors.reduce((sum, b) => sum + b.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosen = behaviors[0];
  for (const b of behaviors) {
    roll -= b.weight;
    if (roll <= 0) {
      chosen = b;
      break;
    }
  }

  changeState(chosen.state);
  const duration = chosen.duration[0] + Math.random() * (chosen.duration[1] - chosen.duration[0]);

  setTimeout(() => {
    if (currentState === chosen.state) {
      changeState(STATES.IDLE);
    }
    scheduleNextBehavior();
  }, duration);
}

// --- Main Tick (walking movement) ---
function tick() {
  if (currentState === STATES.WALKING) {
    petX += WALK_SPEED * walkDirection;

    // Bounce at screen edges
    if (petX <= 0) {
      petX = 0;
      walkDirection = 1;
      spriteEl.style.transform = 'scaleX(1)';
    } else if (petX >= screenWidth - WINDOW_SIZE) {
      petX = screenWidth - WINDOW_SIZE;
      walkDirection = -1;
      spriteEl.style.transform = 'scaleX(-1)';
    }

    invoke('set_position', { x: petX, y: screenHeight - WINDOW_SIZE });
  }
}

// --- Start ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
