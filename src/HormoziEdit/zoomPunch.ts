import { Easing, interpolate } from "remotion";

const PUNCH_DURATION_FRAMES = 9;
const PUNCH_STRENGTH = 0.065;

// A quick scale "punch" fired at each caption-page boundary, mimicking the
// jump-cut / zoom-in energy typical of fast-paced hook edits.
export const getZoomPunchScale = (
  frame: number,
  pageStartFrames: number[],
): number => {
  let scale = 1;

  for (const start of pageStartFrames) {
    if (frame < start || frame >= start + PUNCH_DURATION_FRAMES) {
      continue;
    }

    const local = frame - start;
    const punch = interpolate(
      local,
      [0, 2, PUNCH_DURATION_FRAMES],
      [1, 1 + PUNCH_STRENGTH, 1],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    scale = Math.max(scale, punch);
  }

  return scale;
};
