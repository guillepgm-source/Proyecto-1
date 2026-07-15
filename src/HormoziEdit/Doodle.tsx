import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import type { DoodleBeat } from "./beats";

const { fontFamily } = loadFont();

const INK = "#111111";
const ACCENT = "#39FF88";

// Original hand-drawn-style marker doodles (no external assets), each drawn
// with a "draw-on" stroke reveal followed by a snappy pop, mimicking the
// kind of scribbled reaction marks used in fast-paced creator edits.
const DoodleShell: React.FC<{
  progress: number; // 0..1 draw-on + pop
  exit: number; // 0..1, 1 = fully visible, 0 = faded out
  rotate?: number;
  children: React.ReactNode;
}> = ({ progress, exit, rotate = 0, children }) => {
  const pop = interpolate(progress, [0, 1], [0.4, 1], {
    easing: Easing.out(Easing.back(2.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        transform: `scale(${pop * exit}) rotate(${rotate}deg)`,
        filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.45))",
      }}
    >
      {children}
    </div>
  );
};

const drawStroke = (progress: number, length: number) => ({
  strokeDasharray: length,
  strokeDashoffset: interpolate(progress, [0, 0.7], [length, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
});

const Wave: React.FC<{ progress: number }> = ({ progress }) => (
  <svg viewBox="0 0 200 200" fill="none">
    <circle cx="90" cy="52" r="26" stroke={INK} strokeWidth="9" {...drawStroke(progress, 164)} />
    <path
      d="M90 78 C90 110 88 128 92 158"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
    <path
      d="M92 96 C130 78 150 40 168 26"
      stroke="#39FF88"
      strokeWidth="12"
      strokeLinecap="round"
      {...drawStroke(progress, 130)}
    />
    <path
      d="M90 130 C68 140 55 150 40 168"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
    <path
      d="M92 130 C110 142 118 152 128 170"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
  </svg>
);

const Runner: React.FC<{ progress: number }> = ({ progress }) => (
  <svg viewBox="0 0 200 200" fill="none">
    <circle cx="118" cy="46" r="22" stroke={INK} strokeWidth="9" {...drawStroke(progress, 140)} />
    <path
      d="M110 66 C96 90 100 108 78 122"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
    <path
      d="M106 90 C126 96 138 92 156 74"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
    <path
      d="M78 122 C60 128 46 122 30 132"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 70)}
    />
    <path
      d="M92 108 C104 128 100 150 118 168"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
      {...drawStroke(progress, 90)}
    />
    <path
      d="M20 60 C36 56 44 58 58 52"
      stroke="#4DA3FF"
      strokeWidth="8"
      strokeLinecap="round"
      {...drawStroke(progress, 50)}
    />
    <path
      d="M14 82 C32 78 42 80 58 74"
      stroke="#4DA3FF"
      strokeWidth="8"
      strokeLinecap="round"
      {...drawStroke(progress, 50)}
    />
  </svg>
);

// A quick circled-numeral badge (drawn-on ring + snap-in digit) for rapid
// "1, 2, 3" style list beats - a lightweight background accent, not a
// full cutaway.
const CounterBadge: React.FC<{ progress: number; label: string }> = ({ progress, label }) => (
  <svg viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="72" stroke={ACCENT} strokeWidth="10" {...drawStroke(progress, 452)} />
    <text
      x="100"
      y="134"
      textAnchor="middle"
      fontFamily={fontFamily}
      fontSize="92"
      fill="white"
      style={{ textShadow: "0 0 16px rgba(0,0,0,0.6)" }}
    >
      {label}
    </text>
  </svg>
);

const DOODLE_COMPONENTS = {
  wave: Wave,
  runner: Runner,
};

export const Doodle: React.FC<{ beat: DoodleBeat; frame: number; durationFrames: number }> = ({
  beat,
  frame,
  durationFrames,
}) => {
  const enter = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = interpolate(frame, [0, 10, 20], [-6, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <DoodleShell progress={enter} exit={exit} rotate={wobble}>
      {beat.kind === "counter" ? (
        <CounterBadge progress={enter} label={beat.label} />
      ) : (
        (() => {
          const Component = DOODLE_COMPONENTS[beat.kind];
          return <Component progress={enter} />;
        })()
      )}
    </DoodleShell>
  );
};
