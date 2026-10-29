import { GameOfLife } from './game.js';
import { Renderer } from './renderer.js';
import { PATTERNS } from './patterns.js';

const CELL_SIZE = 12;
const MAX_FRAME_DELTA = 250; // ms; evita "ráfagas" de pasos al volver a la pestaña

// ---------- Referencias al DOM (se buscan una sola vez) ----------
const $ = (selector) => document.querySelector(selector);

const ui = {
  container: $('#board-container'),
  canvas: $('#board'),
  playBtn: $('#btn-play'),
  stepBtn: $('#btn-step'),
  randomBtn: $('#btn-random'),
  clearBtn: $('#btn-clear'),
  speed: $('#speed'),
  speedValue: $('#speed-value'),
  wrap: $('#wrap'),
  grid: $('#grid'),
  pattern: $('#pattern'),
  generation: $('#stat-generation'),
  population: $('#stat-population'),
};

// ---------- Estado de la aplicación ----------
const game = new GameOfLife(1, 1);
const renderer = new Renderer(ui.canvas, CELL_SIZE);

const state = {
  running: false,
  speed: Number(ui.speed.value), // generaciones por segundo
  lastTime: 0,
  accumulator: 0,
  hover: null,      // celda bajo el ratón
  paintValue: null, // true = dibujando, false = borrando, null = sin pulsar
};

// ---------- Renderizado y bucle principal ----------
const numberFormat = new Intl.NumberFormat('es-ES');

function render() {
  renderer.draw(game, state.hover);
  ui.generation.textContent = numberFormat.format(game.generation);
  ui.population.textContent = numberFormat.format(game.population);
}

/**
 * requestAnimationFrame llama a esta función ~60 veces por segundo.
 * El "acumulador" desacopla la velocidad de la simulación de los FPS:
 * vamos sumando el tiempo transcurrido y damos un paso cada 1000/speed ms.
 */
function loop(time) {
  const delta = Math.min(time - state.lastTime, MAX_FRAME_DELTA);
  state.lastTime = time;

  if (state.running) {
    state.accumulator += delta;
    const interval = 1000 / state.speed;
    while (state.accumulator >= interval) {
      game.step();
      state.accumulator -= interval;
    }
  }

  render();
  requestAnimationFrame(loop);
}

function setRunning(running) {
  state.running = running;
  state.accumulator = 0;
  ui.playBtn.textContent = running ? 'Pausar' : 'Iniciar';
  ui.playBtn.setAttribute('aria-pressed', String(running));
}

// ---------- Acciones ----------
const actions = {
  toggle: () => setRunning(!state.running),
  step: () => {
    setRunning(false);
    game.step();
  },
  random: () => game.randomize(),
  clear: () => {
    setRunning(false);
    game.clear();
  },
};

function loadPattern(key) {
  const pattern = PATTERNS[key];
  if (!pattern) return;

  const height = pattern.cells.length;
  const width = pattern.cells[0].length;

  setRunning(false);
  game.clear();
  game.placePattern(
    pattern.cells,
    Math.floor((game.rows - height) / 2),
    Math.floor((game.cols - width) / 2),
  );
}

// ---------- Tamaño del tablero ----------
function fitBoard() {
  const { width, height } = ui.container.getBoundingClientRect();
  const cols = Math.max(10, Math.floor(width / CELL_SIZE));
  const rows = Math.max(10, Math.floor(height / CELL_SIZE));

  if (cols !== game.cols || rows !== game.rows) {
    game.resize(rows, cols);
    renderer.resize(cols * CELL_SIZE, rows * CELL_SIZE);
  }
}

// ---------- Interacción con el ratón / pantalla táctil ----------
function cellFromEvent(event) {
  const rect = ui.canvas.getBoundingClientRect();
  return {
    row: Math.floor((event.clientY - rect.top) / CELL_SIZE),
    col: Math.floor((event.clientX - rect.left) / CELL_SIZE),
  };
}

ui.canvas.addEventListener('pointerdown', (event) => {
  const { row, col } = cellFromEvent(event);
  // Si empiezas sobre una celda viva, borras; si es muerta, dibujas
  state.paintValue = !game.isAlive(row, col);
  game.setCell(row, col, state.paintValue);
  ui.canvas.setPointerCapture(event.pointerId);
});

ui.canvas.addEventListener('pointermove', (event) => {
  const cell = cellFromEvent(event);
  state.hover = game.inBounds(cell.row, cell.col) ? cell : null;
  if (state.paintValue !== null) game.setCell(cell.row, cell.col, state.paintValue);
});

const stopPainting = () => { state.paintValue = null; };
ui.canvas.addEventListener('pointerup', stopPainting);
ui.canvas.addEventListener('pointercancel', stopPainting);
ui.canvas.addEventListener('pointerleave', () => { state.hover = null; });

// ---------- Controles ----------
ui.playBtn.addEventListener('click', actions.toggle);
ui.stepBtn.addEventListener('click', actions.step);
ui.randomBtn.addEventListener('click', actions.random);
ui.clearBtn.addEventListener('click', actions.clear);

ui.speed.addEventListener('input', () => {
  state.speed = Number(ui.speed.value);
  ui.speedValue.textContent = `${state.speed} gen/s`;
});

ui.wrap.addEventListener('change', () => { game.wrap = ui.wrap.checked; });
ui.grid.addEventListener('change', () => { renderer.showGrid = ui.grid.checked; });

for (const [key, pattern] of Object.entries(PATTERNS)) {
  ui.pattern.add(new Option(pattern.name, key));
}

ui.pattern.addEventListener('change', () => {
  loadPattern(ui.pattern.value);
  ui.pattern.value = ''; // permite volver a elegir el mismo patrón
  ui.pattern.blur();
});

// ---------- Atajos de teclado ----------
const shortcuts = {
  ' ': actions.toggle,
  n: actions.step,
  r: actions.random,
  c: actions.clear,
};

document.addEventListener('keydown', (event) => {
  if (event.target.closest('input, select, textarea')) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const action = shortcuts[event.key.toLowerCase()];
  if (action) {
    event.preventDefault(); // evita que Espacio también "pulse" el botón con foco
    action();
  }
});

// ---------- Arranque ----------
fitBoard();
new ResizeObserver(fitBoard).observe(ui.container);
loadPattern('gosperGun');
requestAnimationFrame((time) => {
  state.lastTime = time;
  loop(time);
});
