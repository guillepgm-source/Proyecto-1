import { Easing, interpolate } from "remotion";

const PUNCH_DURATION_FRAMES = 8;
const PUNCH_STRENGTH = 0.14;
const FLASH_DURATION_FRAMES = 6;
const FLASH_STRENGTH = 0.4;

const nearestBoundary = (frame: number, boundaries: number[]): number => {
  let local = Infinity;
  for (const start of boundaries) {
    if (frame >= start && frame - start < local) {
      local = frame - start;
    }
  }
  return local;
};

// A snappy scale "punch" fired at each cut/caption-page boundary, mimicking
// the jump-cut / zoom-in energy typical of fast-paced hook edits.
export const getZoomPunchScale = (
  frame: number,
  boundaries: number[],
): number => {
  const local = nearestBoundary(frame, boundaries);
  if (local >= PUNCH_DURATION_FRAMES) {
    return 1;
  }

  return interpolate(local, [0, 2, PUNCH_DURATION_FRAMES], [1, 1 + PUNCH_STRENGTH, 1], {
    easing: Easing.out(Easing.back(2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// A brief white flash overlay opacity at each cut, for extra kinetic "snap".
export const getFlashOpacity = (frame: number, boundaries: number[]): number => {
  const local = nearestBoundary(frame, boundaries);
  if (local >= FLASH_DURATION_FRAMES) {
    return 0;
  }

  return interpolate(local, [0, 1, FLASH_DURATION_FRAMES], [0, FLASH_STRENGTH, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const KEN_BURNS_CYCLE_FRAMES = 220;
const KEN_BURNS_STRENGTH = 0.06;

// A slow, subtle drift-zoom that runs continuously under the punch effect so
// longer uncut lines still feel alive instead of static.
export const getKenBurnsScale = (frame: number): number => {
  const phase = (frame % KEN_BURNS_CYCLE_FRAMES) / KEN_BURNS_CYCLE_FRAMES;
  const wave = Math.sin(phase * Math.PI * 2 - Math.PI / 2); // -1..1, starts at -1
  return 1 + ((wave + 1) / 2) * KEN_BURNS_STRENGTH;
};

// A tiny rotational wiggle at each cut for extra kinetic energy.
export const getPunchRotation = (frame: number, boundaries: number[]): number => {
  const local = nearestBoundary(frame, boundaries);
  if (local >= PUNCH_DURATION_FRAMES) {
    return 0;
  }

  return interpolate(local, [0, 2, PUNCH_DURATION_FRAMES], [0, -1.6, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
