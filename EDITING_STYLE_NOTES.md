# Notas de estilo de edición (referencia para próximos vídeos)

Esto es una guía acumulada de lo que al usuario le gusta/no le gusta, basada en
referencias reales que ha enviado y feedback explícito. Leer esto antes de
editar un nuevo vídeo para no repetir explicaciones ni errores ya corregidos.

## Formato base
- Siempre 9:16 vertical (TikTok/Reels), nunca 16:9.
- Cortes de silencio reales (no ASR disponible en sandbox - usar
  `ffmpeg silencedetect` + transcripción manual/CapCut como ground truth si el
  usuario la aporta).

## Subtítulos
- **Alineados al centro**, posicionados en la parte alta-media del encuadre
  (no pegados abajo, no en el tercio inferior).
- Texto en su **case natural** (no todo mayúsculas fijas) - solo palabras
  clave puntuales se ponen en mayúscula + color para dar énfasis.
- Referencia `luka.visual` ("Raw vs Edited Hook"): caption de dos líneas,
  fuente bold condensada, línea 1 en blanco, línea 2 (la frase de impacto)
  en un color de acento (cian en su ejemplo) - un estilo de "dos tonos por
  frase" más que karaoke palabra-por-palabra. Tenerlo en cuenta como opción
  de estilo para próximos vídeos si el usuario lo pide explícitamente.
- Nunca usar fuente pixel/8-bit (`PressStart2P`) - el usuario la rechazó
  después de comparar con referencias reales. Usar tipografías bold sans
  (`Anton` u otra similar).
- Sincronización: si el usuario aporta un vídeo con subtítulos ya generados
  (CapCut, etc.), leer los frames literalmente como ground truth en vez de
  intentar generar timing propio.

## Cortes de cámara / cutaways
- El usuario quiere cortes REALES a pantalla negra (no overlays en la esquina
  sobre el plano continuo). El audio de la narración sigue sonando mientras
  se ve el cutaway.
- Cortos y numerosos (1.3-2.5s cada uno), repartidos por todo el vídeo, no
  2-3 cutaways largas.
- Los cutaways deben tener sentido narrativo claro - nunca una flecha o
  animación "flotando" sin contexto. El formato que SÍ funcionó y fue
  aprobado: **icono "antes" → flecha que se dibuja (con sonido de
  construcción tipo "tototo") → icono "después"** (ver
  `TransformCutaway` en `src/HormoziEdit/Cutaway.tsx`). Preferir este
  patrón sobre una flecha suelta con solo texto.
- Nada de emojis literales en ningún gráfico - solo iconos originales
  dibujados (SVG propios).
- Evitar dejar tramos largos (>8-10s) sin ningún acento visual/sonoro en
  medio del vídeo - revisar `beats.ts` para huecos grandes tras cualquier
  cambio.

## Animaciones/doodles sobre el plano continuo
- Si van encima del vídeo en directo (no cutaway completo), deben ser
  GRANDES y claramente visibles, nunca un icono diminuto metido en una
  esquina.

## Efectos de sonido
- Sintetizados localmente con Python/numpy (no hay acceso a librerías de
  stock). Mantener el volumen bajo - el usuario ha pedido bajarlo dos veces
  ya. Ver `VOLUME_SCALE` en `src/HormoziEdit/SfxLayer.tsx` (actualmente 0.4).

## Efectos de cámara/zoom
- Punch-zoom en cada corte + un Ken Burns sutil continuo están bien.
- Nada de "shake" constante tipo discoteca - el usuario lo rechazó
  explícitamente.
- Freeze-frame: probado y luego ELIMINADO por petición del usuario (le
  resultaba confuso). No reintroducirlo salvo que lo pida de nuevo.

## Calidad de render / entrega
- `SendUserFile` tiene un límite duro de 30MB. Buscar `scale` que dé
  dimensiones enteras (1080x1920 → 0.6, 0.65, 0.7, 0.75, 0.8... no 0.72).
  Ajuste actual que da buen equilibrio calidad/tamaño: `--scale=0.7
  --jpeg-quality=83 --audio-bitrate=112k` (~26-27MB para un vídeo de ~68s).
- Usar `SANDBOX_CHROMIUM_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
  para que Remotion no intente descargar su propio Chromium (bloqueado por
  el proxy de red).

## Checklist de optimización de hook (con dato real detrás)
Referencia `ivanprietox` ("Subí dos veces el mismo vídeo..."): subió el
mismo vídeo dos veces cambiando solo el gancho y comparó retención -
**53% → 61%**. Los cambios concretos que hizo, en este orden:
1. **Color rojo** en las palabras clave del texto en pantalla (ya lo hacemos).
2. **Las palabras** - reescribir el copy del hook en sí, no solo el estilo.
3. **La fuente** - cambiar la tipografía del texto en pantalla.
4. **Mover** - reposicionar dónde cae el texto en el encuadre.
5. **Iluminación** - aclarar/realzar la cara (función "Enhance" de CapCut).
6. **Añadir música** - un track de música de fondo continuo, en pista
   separada de la voz y separada de los SFX puntuales (su timeline tenía
   `Final voiceover clean.mp3` + `solo musica v2.mp3` + SFX sueltos tipo
   `swish`/`typing`). **Esto es nuevo para nosotros**: `SfxLayer.tsx` solo
   tiene efectos puntuales, no hay música de fondo continua bajo la voz -
   valorar añadir un lecho musical de bajo volumen en el próximo vídeo.

Cuando el usuario pida "mejora el gancho/hook", repasar esta lista de 6
puntos como checklist antes de improvisar algo nuevo.

## Referencias enviadas por el usuario
- **devinjatho** (Instagram) - referencia principal de formato general:
  subtítulos centrados, cutaways a pantalla negra con dibujos/flechas,
  transiciones dinámicas, sin fuente pixel.
- **luka.visual** (TikTok/IG, vídeo "Raw vs Edited Hook") - referencia de
  estilo de caption de dos tonos y de la idea de "capas de edición"
  (color correction, reframe+zoom, captions, animations, audio) como
  checklist mental de qué aplicar a un hook para que quede completo.
- **ivanprietox** (TikTok/IG, vídeo "Subí dos veces el mismo vídeo...") -
  referencia táctica de qué cambios de hook mueven la retención de verdad
  (ver checklist arriba), con dato de antes/después real.

## Contexto del canal
- Nicho: fitness/gimnasio. El usuario trabaja en un gimnasio y su ángulo
  fuerte es contenido basado en errores/situaciones reales que ve en el
  trabajo.
- Cuenta en fase de crecimiento (pocas vistas iniciales) - ver conversación
  para ideas de contenido y pilares sugeridos (corrección de forma, rutinas
  guardables, POV, mitos vs realidad).
