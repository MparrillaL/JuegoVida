# Juego de la Vida

Simulador interactivo del **Juego de la Vida de John Conway** hecho con HTML, CSS y JavaScript puro (sin librerías ni frameworks).

## Características

- Simulación en tiempo real con velocidad ajustable (1–60 generaciones por segundo).
- Dibujo de celdas con ratón, lápiz o pantalla táctil.
- Patrones clásicos: planeador, nave ligera (LWSS), púlsar, R-pentominó y cañón de Gosper.
- Bordes conectados (toroide) o cerrados.
- Cuadrícula opcional y contador de generación y población.
- Atajos de teclado.
- Diseño adaptable a móvil y renderizado nítido en pantallas de alta densidad.

## Cómo ejecutarlo

El proyecto usa **módulos ES** (`import`/`export`), así que **no funciona abriendo `index.html` con doble clic**: los navegadores bloquean los módulos cargados desde `file://`. Necesitas un servidor local:

- **VS Code:** instala la extensión *Live Server*, haz clic derecho en `index.html` y elige *Open with Live Server*.
- **Terminal:** ejecuta `npx serve` en la carpeta del proyecto y abre la URL que aparezca.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Espacio` | Iniciar / pausar |
| `N` | Siguiente generación |
| `R` | Tablero aleatorio |
| `C` | Limpiar |

## Estructura del proyecto

```
JuegoVida/
├── index.html          → Estructura (qué hay en la página)
├── css/styles.css      → Presentación (cómo se ve)
└── js/
    ├── game.js         → Lógica pura: reglas del juego (no toca el DOM)
    ├── renderer.js     → Dibujo en <canvas> (no conoce las reglas)
    ├── patterns.js     → Datos: patrones famosos
    └── main.js         → Controlador: conecta la interfaz con la lógica
```

---

# 📚 Guía teórica

## Parte 1. ¿Qué es el Juego de la Vida?

### Origen

Lo inventó el matemático británico **John Horton Conway** en **1970**. Se hizo famoso al publicarse en la columna de juegos matemáticos de Martin Gardner en *Scientific American*.

Se llama "juego", pero es un **juego de cero jugadores**: tú decides el estado inicial y a partir de ahí evoluciona solo. No hay que ganar a nadie. Se observa qué pasa.

### Qué es técnicamente: un autómata celular

Un **autómata celular** tiene cuatro ingredientes:

| Ingrediente | En el Juego de la Vida |
|---|---|
| Una **rejilla** de celdas | Un tablero 2D de cuadrados |
| Un **conjunto de estados** por celda | Solo dos: viva (1) o muerta (0) |
| Una **vecindad** | Las 8 celdas que la rodean (*vecindad de Moore*) |
| Una **regla de transición** | Las 3 reglas de Conway |

El tiempo avanza a saltos discretos llamados **generaciones**. En cada salto **todas las celdas se actualizan a la vez**, cada una según cómo estaban sus vecinas en la generación anterior. Recuerda esta idea de "a la vez", porque es la clave de buena parte del código.

### Las reglas

```
Vecinas vivas:   0   1   2   3   4   5   6   7   8
Celda viva   →   ✗   ✗   ✓   ✓   ✗   ✗   ✗   ✗   ✗   (sobrevive con 2 o 3)
Celda muerta →   ·   ·   ·   ✓   ·   ·   ·   ·   ·   (nace con 3)
```

- **Soledad:** una celda viva con menos de 2 vecinas muere.
- **Supervivencia:** una celda viva con 2 o 3 vecinas sigue viva.
- **Superpoblación:** una celda viva con más de 3 vecinas muere.
- **Nacimiento:** una celda muerta con exactamente 3 vecinas nace.

En la jerga se escribe **B3/S23**: *Born* (nace) con 3, *Survives* (sobrevive) con 2 o 3. Si cambias esos números obtienes otros "universos", como HighLife (B36/S23).

### La gran idea: la emergencia

Con unas reglas tan simples aparecen comportamientos complejos que **nadie programó explícitamente**. A eso se le llama **emergencia**. Por eso los patrones se clasifican casi como si fueran una fauna:

- **Vidas estáticas** (*still lifes*): no cambian nunca. Ejemplo: un bloque de 2×2.
- **Osciladores:** se repiten cada N generaciones. Ejemplos: el parpadeador (periodo 2) y el púlsar (periodo 3).
- **Naves** (*spaceships*): se desplazan por el tablero. Ejemplos: el planeador y la LWSS.
- **Cañones:** generan naves sin parar. El cañón de Gosper dispara un planeador cada 30 generaciones.
- **Matusalenes:** patrones pequeños que tardan muchísimo en estabilizarse. El R-pentominó, con solo 5 células, necesita 1103 generaciones.

Todos estos ejemplos están en [`js/patterns.js`](js/patterns.js) para que los veas en acción.

---

## Parte 2. ¿Para qué sirve? Aplicaciones reales

### En ciencia e informática teórica

- **Es Turing completo.** Con planeadores como "bits" y cañones como "cables" se pueden construir puertas lógicas, memorias y, en teoría, cualquier ordenador. Hay quien ha programado el propio Juego de la Vida *dentro* del Juego de la Vida. La lección: **la computación no depende del hardware, sino de las reglas.**
- **Estudio de sistemas complejos.** Sirve de ejemplo de cómo reglas locales producen un comportamiento global, algo que se ve en hormigueros, mercados o redes neuronales.

### Los autómatas celulares en el mundo real

El Juego de la Vida es el más famoso, pero la misma técnica se usa para:

- **Simular incendios forestales:** cada celda es un árbol que arde según sus vecinos y el viento.
- **Simular el tráfico:** el modelo de Nagel-Schreckenberg reproduce atascos que aparecen "de la nada".
- **Biología y medicina:** crecimiento de tumores, propagación de epidemias, patrones en conchas marinas.
- **Videojuegos:** generación procedural de cuevas y mapas. Es muy común rellenar una rejilla al azar y aplicar unas cuantas generaciones de una regla parecida para obtener cuevas de aspecto natural.
- **Números pseudoaleatorios:** la *Regla 30* de Stephen Wolfram, un autómata de una dimensión, se ha usado como generador de números aleatorios.
- **Procesamiento de imágenes:** eliminación de ruido y detección de bordes.

### Por qué es un ejercicio clásico en DAW

Porque en un proyecto pequeño practicas casi todo lo importante del desarrollo front-end: **estructuras de datos, bucles anidados, gestión de estado, renderizado, eventos, rendimiento y arquitectura**.

---

## Parte 3. La arquitectura del proyecto

### Separación de responsabilidades

Cada archivo hace **una sola cosa**. Es una versión sencilla del patrón **MVC** (Modelo–Vista–Controlador):

```
            ┌──────────────┐
            │ patterns.js  │  DATOS: patrones (solo información)
            └──────┬───────┘
                   │ importa
┌──────────────────▼─────────────────────┐
│               main.js                  │  CONTROLADOR
│  · escucha botones, ratón y teclado    │  (el "pegamento")
│  · lleva el bucle de animación         │
└──────┬─────────────────────────┬───────┘
       │ game.step()             │ renderer.draw(game)
┌──────▼───────┐          ┌──────▼───────┐
│   game.js    │          │ renderer.js  │
│   MODELO     │◄─ lee ───│    VISTA     │
│ reglas, datos│          │ pinta canvas │
│  (sin DOM)   │          │(sin reglas)  │
└──────────────┘          └──────────────┘
```

**¿Qué ganamos con esto?**

- `game.js` no usa `document` ni `canvas`, así que se puede **probar en Node.js** sin navegador.
- Si mañana quieres dibujar con WebGL o con `<div>`, solo cambias `renderer.js`.
- Si quieres reglas distintas (HighLife), solo cambias `game.js`.
- Cada archivo es corto y se entiende por separado.

### Módulos ES

Cada archivo **exporta** lo que ofrece (`export class GameOfLife`) y **importa** lo que necesita (`import { GameOfLife } from './game.js'`). En el HTML se carga con `<script type="module">`, que además:

- Espera a que el HTML esté cargado (como `defer`), así que los `querySelector` encuentran los elementos.
- Ejecuta el código en modo estricto y con ámbito propio: no hay variables globales sueltas.
- **Requiere un servidor.** Los navegadores aplican la política **CORS** a los módulos, y desde `file://` no hay un origen válido.

---

## Parte 4. La lógica, paso a paso ([`js/game.js`](js/game.js))

### 4.1 Cómo se guarda el tablero: el array plano

Lo intuitivo sería una matriz `cells[fila][col]`. Nosotros usamos **un único array**:

```js
index(row, col) {
  return row * this.cols + col;
}
```

Visualízalo con un tablero de 3 filas × 4 columnas:

```
Matriz lógica:         Array real en memoria:
     c0 c1 c2 c3
f0 [ 0  1  2  3 ]      [0,1,2,3, 4,5,6,7, 8,9,10,11]
f1 [ 4  5  6  7 ]       └─fila0─┘└─fila1─┘└──fila2──┘
f2 [ 8  9 10 11 ]

Celda (fila 2, col 1) → 2 * 4 + 1 = 9 ✓
```

Las filas se colocan una detrás de otra. Además usamos un **`Uint8Array`** (array tipado) en lugar de un array normal:

- Cada celda ocupa **1 byte**. En un array normal cada elemento es un valor JS genérico y ocupa bastante más.
- Los datos están contiguos en memoria, lo que es **mucho más rápido** de recorrer.
- Se inicializa a ceros automáticamente.

### 4.2 Contar vecinas (`countNeighbors`)

Recorremos los desplazamientos de -1 a +1 en filas y columnas. Son 9 combinaciones y saltamos el (0,0), que es la propia celda:

```
(-1,-1) (-1,0) (-1,+1)
( 0,-1)  [YO]  ( 0,+1)
(+1,-1) (+1,0) (+1,+1)
```

Como las celdas valen 0 o 1, **sumarlas da directamente el número de vecinas vivas**: `count += this.cells[...]`. Ese truco ahorra un `if`.

### 4.3 Los bordes: el toroide y el operador módulo

¿Qué vecinas tiene una celda del borde? Hay dos opciones y el proyecto implementa ambas (casilla "Bordes conectados"):

- **Bordes cerrados:** fuera del tablero todo está muerto, y esas posiciones se saltan con `continue`.
- **Toroide:** el borde derecho se conecta con el izquierdo y el de arriba con el de abajo, como en el Pac-Man. Topológicamente es la superficie de un dónut.

```js
r = (r + this.rows) % this.rows;
```

Ejemplo con 10 filas:

| r | (r + 10) % 10 | Resultado |
|---|---|---|
| -1 | 9 % 10 | **9** (la última fila) ✓ |
| 5 | 15 % 10 | **5** (sin cambios) ✓ |
| 10 | 20 % 10 | **0** (la primera fila) ✓ |

**¿Por qué sumar `rows` antes?** Porque en JavaScript `-1 % 10` da **`-1`**, no 9: el operador `%` conserva el signo. Sumando `rows` nos aseguramos de que el número sea positivo.

### 4.4 El doble buffer: la parte más importante (`step`)

Recuerda: **todas las celdas cambian a la vez**. Imagina que modificamos el array directamente mientras lo recorremos:

```
Recorremos de izquierda a derecha y calculamos la celda A.
A muere → la ponemos a 0 YA.
Pasamos a su vecina B → cuenta sus vecinas… ¡y ve A muerta!
Pero en la generación actual A estaba VIVA. B calcula mal. ❌
```

La solución es usar **dos arrays**:

- `cells` es la generación actual y **solo se lee**.
- `next` es la generación siguiente y **solo se escribe**.

Al terminar se intercambian:

```js
[this.cells, this.next] = [this.next, this.cells];
```

Esto es **desestructuración** de ES6. Fíjate en que **no creamos arrays nuevos**: solo se intercambian las referencias. Crear un array en cada generación (60 veces por segundo) obligaría al *recolector de basura* a trabajar sin parar.

La técnica se llama **double buffering** y la verás también en videojuegos y gráficos: se dibuja en una pantalla oculta y luego se cambia por la visible.

### 4.5 Las reglas en una línea

```js
this.next[i] = neighbors === 3 || (alive && neighbors === 2) ? 1 : 0;
```

¿Cómo caben 4 reglas en una línea? Piensa en cuándo una celda **acaba viva**:

- Si tiene **3 vecinas**, siempre acaba viva: si estaba viva sobrevive, y si estaba muerta nace.
- Si tiene **2 vecinas**, solo acaba viva si ya lo estaba.
- En cualquier otro caso, acaba muerta.

### 4.6 Coste computacional

Cada generación recorre todas las celdas y mira 8 vecinas: **O(filas × columnas)**. En un tablero de 100×60 son 6.000 celdas × 8 = 48.000 operaciones por generación. Un navegador moderno lo hace en microsegundos.

---

## Parte 5. El dibujo ([`js/renderer.js`](js/renderer.js))

### 5.1 ¿Por qué `<canvas>` y no `<div>`?

Podríamos crear un `<div>` por celda, pero serían miles de elementos en el DOM actualizándose 60 veces por segundo, y eso es muy lento. Con `<canvas>` tenemos **un solo elemento** en el que pintamos píxeles directamente. Es el **modo inmediato** de dibujo: se pinta y se olvida. El DOM, en cambio, funciona en **modo retenido**: el navegador recuerda cada elemento.

### 5.2 Cómo se dibuja un fotograma

1. Se pinta todo el fondo, lo que borra el fotograma anterior.
2. Se recorren las celdas y cada celda viva se pinta con `fillRect(x, y, tamaño, tamaño)`, donde `x = col * cellSize` e `y = row * cellSize`.
3. Se dibuja la cuadrícula **en un solo *path***: muchas órdenes `moveTo/lineTo` y un único `stroke()`, que es mucho más eficiente que trazar línea a línea.
4. Se resalta la celda que hay bajo el ratón.

### 5.3 Pantallas de alta densidad (`resize`)

En un móvil o un portátil retina, **1 píxel CSS = 2 o 3 píxeles físicos** (`devicePixelRatio`). Si el canvas mide 600 píxeles internos y se muestra a 600 px CSS en una pantalla 2x, el navegador lo estira y se ve borroso. Por eso:

- El tamaño interno (`canvas.width`) se multiplica por `dpr`.
- El tamaño visual (`canvas.style.width`) se deja en píxeles CSS.
- Con `setTransform(dpr, ...)` el contexto se escala, así que el resto del código sigue trabajando en píxeles CSS normales.

### 5.4 Colores desde el CSS (`readColors`)

```js
getComputedStyle(document.documentElement).getPropertyValue('--cell')
```

JavaScript lee las **variables CSS** de `styles.css`. Así se cumple el principio **DRY** (*Don't Repeat Yourself*): los colores se definen en un solo sitio. Cambias `--cell` en el CSS y cambia el color de las células.

---

## Parte 6. El controlador ([`js/main.js`](js/main.js))

### 6.1 Ciclo de vida de la aplicación

```
ARRANQUE (al final del archivo)
 1. fitBoard()            → calcula filas y columnas según el espacio disponible
 2. ResizeObserver        → vuelve a calcularlas si cambia el tamaño de la ventana
 3. loadPattern('gosperGun')
 4. requestAnimationFrame(loop) → arranca el bucle infinito
          │
          ▼
BUCLE (~60 veces/segundo)          EVENTOS (en cualquier momento)
 ┌─► ¿está en marcha?               clic, tecla, ratón…
 │     sí → game.step() las veces    → modifican el estado
 │          que toquen                 (game, state)
 │   render()                          y el siguiente fotograma
 └── requestAnimationFrame(loop)       lo dibuja
```

Importante: **los eventos no dibujan**. Solo cambian el estado, y el bucle se encarga de pintar. Así hay un único lugar donde se dibuja, y el código es predecible.

### 6.2 El bucle con acumulador (`loop`)

**El problema:** `requestAnimationFrame` se ejecuta al ritmo de la pantalla (60 Hz, 120 Hz, 144 Hz…), pero el usuario quiere, por ejemplo, **10 generaciones por segundo**, sea cual sea su monitor.

**La solución:** un "depósito" de tiempo.

```js
state.accumulator += delta;            // añadimos el tiempo transcurrido
const interval = 1000 / state.speed;   // ms que dura cada generación
while (state.accumulator >= interval) {
  game.step();                         // gastamos tiempo del depósito
  state.accumulator -= interval;
}
```

Ejemplo a 10 gen/s (intervalo de 100 ms) en una pantalla de 60 Hz (un fotograma cada 16,7 ms):

| Fotograma | Acumulador | ¿Paso? |
|---|---|---|
| 1 | 16,7 | No |
| 2 | 33,3 | No |
| … | … | … |
| 6 | 100,2 | **Sí** → queda 0,2 |
| 7 | 16,9 | No |

Resultado: una generación cada 6 fotogramas, es decir, 10 por segundo, **en cualquier monitor**. Es la técnica de *fixed timestep* de los motores de videojuegos.

**`MAX_FRAME_DELTA = 250`:** cuando cambias de pestaña, el navegador pausa `requestAnimationFrame`. Al volver, `delta` podría ser de 30 segundos, y a 60 gen/s eso serían 1.800 pasos de golpe: la página se congelaría. Limitar `delta` evita ese problema.

### 6.3 El objeto `state`

Todo lo que cambia en la aplicación está en **un único objeto**: si está corriendo, la velocidad, la celda bajo el ratón, si estás pintando… Centralizar el estado es la base de frameworks como React o Vue (con `useState`, Pinia o Redux). Aquí lo hacemos a mano, pero la idea es la misma.

### 6.4 Tablas de despacho en lugar de `if/else` (`actions` y `shortcuts`)

En vez de:

```js
if (key === ' ') toggle();
else if (key === 'n') step();
else if (key === 'r') random();
```

usamos un objeto que asocia cada tecla con una función:

```js
const shortcuts = { ' ': actions.toggle, n: actions.step, ... };
const action = shortcuts[event.key.toLowerCase()];
if (action) action();
```

Las **funciones son valores** en JavaScript (son *ciudadanos de primera clase*), así que podemos guardarlas en objetos. Añadir un atajo nuevo es añadir una línea. Además, `actions` se reutiliza: el botón "Paso" y la tecla N llaman exactamente a la misma función.

### 6.5 Del ratón a la celda (`cellFromEvent`)

```js
const rect = ui.canvas.getBoundingClientRect();     // dónde está el canvas en pantalla
row = Math.floor((event.clientY - rect.top) / CELL_SIZE);
```

1. `clientY` es la posición del ratón en la ventana.
2. Al restarle `rect.top` obtenemos la posición **dentro del canvas**.
3. Al dividir entre el tamaño de celda y redondear hacia abajo obtenemos **el número de fila**.

Es la operación inversa a la de dibujar: para pintar hacemos `celda × tamaño = píxel`, y aquí hacemos `píxel ÷ tamaño = celda`.

**Pointer Events:** `pointerdown/move/up` unifican ratón, lápiz y dedo en una sola API. `setPointerCapture` hace que el canvas siga recibiendo eventos aunque el puntero salga de él. `touch-action: none` en el CSS evita que en el móvil arrastrar el dedo haga scroll en lugar de dibujar.

### 6.6 Diseño adaptable con `ResizeObserver`

Vigila el contenedor del tablero y, cuando cambia de tamaño, recalcula cuántas filas y columnas caben. `game.resize()` conserva las células de la zona común, así que no pierdes tu dibujo al redimensionar la ventana.

---

## Parte 7. Resumen de conceptos

| Concepto | Dónde está | Dónde lo volverás a ver |
|---|---|---|
| Separación de responsabilidades / MVC | Estructura de archivos | Cualquier proyecto profesional, Angular, Laravel… |
| Módulos ES (`import/export`) | Todos los `.js` | React, Vue, Node.js |
| Arrays tipados y aplanar matrices | `game.js` | Gráficos, procesamiento de imágenes, WebGL |
| Operador módulo para "dar la vuelta" | `countNeighbors` | Carruseles, calendarios, buffers circulares |
| Doble buffer | `step()` | Videojuegos, gráficos, concurrencia |
| Canvas 2D y `devicePixelRatio` | `renderer.js` | Gráficas, juegos, editores |
| Bucle de juego con acumulador | `loop()` | Motores de videojuegos y animaciones |
| Estado centralizado | `state` | React, Vue, Redux |
| Tablas de despacho | `actions`, `shortcuts` | Routers, intérpretes, reducers |
| Variables CSS como fuente única | `:root` | Temas claro/oscuro, sistemas de diseño |

---

## 📝 Preguntas de autoevaluación

1. ¿Qué pasaría si eliminas el array `next` y escribes directamente en `cells`?
2. En un tablero de 8 columnas, ¿en qué índice del array está la celda (fila 3, columna 5)?
3. ¿Por qué escribimos `(c + cols) % cols` y no simplemente `c % cols`?
4. Si la velocidad es de 30 gen/s y el monitor va a 60 Hz, ¿cada cuántos fotogramas se da un paso?
5. ¿Por qué los eventos del ratón no llaman a `render()` directamente?
6. ¿Qué cambiarías en `game.js` para implementar HighLife (B36/S23)?
7. ¿Por qué el proyecto no funciona abriendo `index.html` con doble clic?

<details>
<summary>Soluciones</summary>

1. Las celdas usarían valores ya modificados de sus vecinas y el resultado sería incorrecto. Los patrones como el planeador dejarían de funcionar.
2. 3 × 8 + 5 = **29**.
3. Porque en JS `-1 % 8 === -1`. Sumando `cols` el resultado siempre es positivo: `7 % 8 = 7`.
4. Cada **2** fotogramas (intervalo de 33,3 ms frente a 16,7 ms por fotograma).
5. Para que haya un único sitio donde se dibuja. Los eventos solo modifican el estado y el bucle lo pinta en el siguiente fotograma. Así el código es más simple y predecible.
6. La línea de la regla: `neighbors === 3 || (!alive && neighbors === 6) || (alive && neighbors === 2)`.
7. Porque los módulos ES están sujetos a CORS y `file://` no es un origen válido; hace falta un servidor HTTP.

</details>

---

## 🧩 Retos propuestos

1. Añade un nuevo patrón a `patterns.js`, por ejemplo el *Pentadecathlon*.
2. Detén la simulación automáticamente cuando la población llegue a 0.
3. Añade un control de **tamaño de celda** (zoom).
4. Colorea las células según su "edad" (cuántas generaciones llevan vivas).
5. Optimización: dibuja solo cuando algo cambia, en lugar de en cada fotograma.
