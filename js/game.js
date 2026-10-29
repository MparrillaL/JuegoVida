/**
 * Lógica pura del Juego de la Vida.
 * No conoce el DOM ni el canvas: solo celdas y reglas.
 *
 * El tablero se guarda en un array plano (Uint8Array) en lugar de un
 * array de arrays: la celda (fila, columna) está en la posición
 * fila * columnas + columna. Es más rápido y usa menos memoria.
 */
export class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = new Uint8Array(rows * cols); // 1 = viva, 0 = muerta
    this.next = new Uint8Array(rows * cols);  // buffer para la siguiente generación
    this.generation = 0;
    this.wrap = true; // si es true, los bordes se conectan (toroide)
  }

  index(row, col) {
    return row * this.cols + col;
  }

  inBounds(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  isAlive(row, col) {
    return this.inBounds(row, col) && this.cells[this.index(row, col)] === 1;
  }

  setCell(row, col, alive) {
    if (!this.inBounds(row, col)) return;
    this.cells[this.index(row, col)] = alive ? 1 : 0;
  }

  countNeighbors(row, col) {
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue; // la propia celda no cuenta

        let r = row + dr;
        let c = col + dc;

        if (this.wrap) {
          // El módulo hace que -1 pase a ser la última fila/columna y viceversa
          r = (r + this.rows) % this.rows;
          c = (c + this.cols) % this.cols;
        } else if (!this.inBounds(r, c)) {
          continue;
        }

        count += this.cells[this.index(r, c)];
      }
    }

    return count;
  }

  /** Calcula la siguiente generación aplicando las reglas de Conway. */
  step() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const i = this.index(row, col);
        const neighbors = this.countNeighbors(row, col);
        const alive = this.cells[i] === 1;

        // Nace con 3 vecinas; sobrevive con 2 o 3; en otro caso muere.
        this.next[i] = neighbors === 3 || (alive && neighbors === 2) ? 1 : 0;
      }
    }

    // Intercambiamos los buffers en vez de crear arrays nuevos cada vez
    [this.cells, this.next] = [this.next, this.cells];
    this.generation++;
  }

  get population() {
    let total = 0;
    for (const cell of this.cells) total += cell;
    return total;
  }

  clear() {
    this.cells.fill(0);
    this.generation = 0;
  }

  randomize(density = 0.25) {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = Math.random() < density ? 1 : 0;
    }
    this.generation = 0;
  }

  /** Cambia el tamaño conservando las celdas de la zona común. */
  resize(rows, cols) {
    const cells = new Uint8Array(rows * cols);
    const minRows = Math.min(rows, this.rows);
    const minCols = Math.min(cols, this.cols);

    for (let r = 0; r < minRows; r++) {
      for (let c = 0; c < minCols; c++) {
        cells[r * cols + c] = this.cells[this.index(r, c)];
      }
    }

    this.rows = rows;
    this.cols = cols;
    this.cells = cells;
    this.next = new Uint8Array(rows * cols);
  }

  /**
   * Coloca un patrón con su esquina superior izquierda en (top, left).
   * El patrón es un array de strings donde 'O' es una célula viva.
   */
  placePattern(pattern, top, left) {
    pattern.forEach((line, r) => {
      [...line].forEach((char, c) => {
        if (char === 'O') this.setCell(top + r, left + c, true);
      });
    });
  }
}
