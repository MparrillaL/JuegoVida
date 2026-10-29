/**
 * Dibuja el estado del juego en un <canvas>.
 * No conoce las reglas: solo recibe un tablero y lo pinta.
 */
export class Renderer {
  constructor(canvas, cellSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cellSize = cellSize;
    this.showGrid = true;
    this.colors = this.readColors();
  }

  /** Lee los colores de las variables CSS para no duplicarlos en JS. */
  readColors() {
    const styles = getComputedStyle(document.documentElement);
    const css = (name) => styles.getPropertyValue(name).trim();
    return {
      background: css('--board-bg'),
      cell: css('--cell'),
      grid: css('--grid-line'),
      hover: 'rgba(255, 255, 255, 0.25)',
    };
  }

  /**
   * Ajusta el tamaño del canvas teniendo en cuenta devicePixelRatio,
   * para que se vea nítido en pantallas de alta densidad (retina, móviles).
   */
  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(game, hover = null) {
    const { ctx, cellSize, colors } = this;
    const width = game.cols * cellSize;
    const height = game.rows * cellSize;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = colors.cell;
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        if (game.cells[game.index(row, col)]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    if (this.showGrid) this.drawGrid(game, width, height);
    if (hover) this.drawHover(hover);
  }

  drawGrid(game, width, height) {
    const { ctx, cellSize } = this;
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Un solo path con todas las líneas es mucho más rápido que un stroke por línea
    for (let col = 0; col <= game.cols; col++) {
      const x = col * cellSize + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let row = 0; row <= game.rows; row++) {
      const y = row * cellSize + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }

  drawHover({ row, col }) {
    const { ctx, cellSize } = this;
    ctx.strokeStyle = this.colors.hover;
    ctx.lineWidth = 1;
    ctx.strokeRect(col * cellSize + 0.5, row * cellSize + 0.5, cellSize - 1, cellSize - 1);
  }
}
