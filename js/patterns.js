/**
 * Patrones clásicos. Cada fila es un string: 'O' = viva, '.' = muerta.
 * Guardarlos así hace que se "vean" en el propio código.
 */
export const PATTERNS = {
  glider: {
    name: 'Planeador (Glider)',
    cells: [
      '.O.',
      '..O',
      'OOO',
    ],
  },
  lwss: {
    name: 'Nave ligera (LWSS)',
    cells: [
      '.O..O',
      'O....',
      'O...O',
      'OOOO.',
    ],
  },
  pulsar: {
    name: 'Púlsar',
    cells: [
      '..OOO...OOO..',
      '.............',
      'O....O.O....O',
      'O....O.O....O',
      'O....O.O....O',
      '..OOO...OOO..',
      '.............',
      '..OOO...OOO..',
      'O....O.O....O',
      'O....O.O....O',
      'O....O.O....O',
      '.............',
      '..OOO...OOO..',
    ],
  },
  rPentomino: {
    name: 'R-pentominó',
    cells: [
      '.OO',
      'OO.',
      '.O.',
    ],
  },
  gosperGun: {
    name: 'Cañón de Gosper',
    cells: [
      '........................O...........',
      '......................O.O...........',
      '............OO......OO............OO',
      '...........O...O....OO............OO',
      'OO........O.....O...OO..............',
      'OO........O...O.OO....O.O...........',
      '..........O.....O.......O...........',
      '...........O...O....................',
      '............OO......................',
    ],
  },
};
