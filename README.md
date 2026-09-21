# Luna en Villa Pelón

RPG narrativo, exploratorio y educativo inspirado en San Patricio del Chañar.

## Estado actual

**Versión:** 0.1.0 — vertical slice técnico.

El repositorio partía vacío. Esta primera arquitectura establece una sola fuente de verdad y un bucle jugable mínimo:

**movimiento → exploración → interacción → descubrimiento → misión → recompensa → memoria.**

## Arquitectura

- `index.html`: superficie del juego y controles.
- `styles.css`: interfaz responsive y controles táctiles.
- `src/main.js`: composición de entrada y UI.
- `src/game.js`: bucle principal, mundo, entidades, interacción, misión y guardado.
- `src/data.js`: datos declarativos de mundo, NPC, misiones y memorias.

No se incorporan dependencias externas ni un segundo motor. El juego puede ejecutarse como sitio estático.

## Regla histórica

Los datos históricos no se inventan para rellenar el juego. Las memorias pueden clasificarse como:

- VERIFIED
- PARTIALLY_VERIFIED
- RESEARCH_REQUIRED
- FICTIONALIZED

Hasta disponer de fuentes, el contenido pendiente se presenta explícitamente como investigación.

## Vertical slice

La primera experiencia funcional permite:

1. mover a Luna;
2. recorrer una representación inicial de Villa Pelón;
3. acercarse a personajes y lugares;
4. conversar;
5. activar una misión;
6. descubrir la Plaza;
7. completar la misión;
8. obtener una recompensa;
9. registrar una memoria pendiente de investigación;
10. guardar y recuperar la partida;
11. consultar el diario;
12. jugar con teclado o controles táctiles.

## Próxima intervención estructural

Auditar el vertical slice en navegador y después cerrar, en este orden:

1. colisiones y circulación;
2. interacción unificada;
3. cambios de estado del mundo;
4. mapa por zonas con lógica territorial;
5. datos históricos verificados;
6. NPC con horarios y relaciones;
7. progresión de conocimiento;
8. inventario y economía simple;
9. guardado robusto;
10. QA y optimización móvil.

La regla del proyecto sigue siendo: **CLARIDAD > CANTIDAD**.
