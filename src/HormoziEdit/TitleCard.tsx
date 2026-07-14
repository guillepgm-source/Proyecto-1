import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily: pixelFont } = loadFont();

const ACCENT = "#39FF88";

// A big cold-open style title card in a glowing 8-bit font, echoing the
// pixel-game title cards from the devinjatho reference edit.
export const TitleCard: React.FC<{
  lineAccent: string;
  lineWhite: string;
  durationFrames: number;
}> = ({ lineAccent, lineWhite, durationFrames }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 12], [0, 1], {
    easing: Easing.out(Easing.back(1.8)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const lineGrow = interpolate(frame, [0, 10], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: enter * exit,
        transform: `scale(${0.85 + enter * 0.15})`,
      }}
    >
      <div
        style={{
          width: 3,
          height: 70 * lineGrow,
          background: ACCENT,
          boxShadow: `0 0 12px ${ACCENT}`,
          marginBottom: 14,
        }}
      />
      <div
        style={{
          fontFamily: pixelFont,
          fontSize: 34,
          lineHeight: 1.7,
          textAlign: "center",
          color: ACCENT,
          textShadow: `0 0 14px ${ACCENT}, 0 0 30px ${ACCENT}`,
        }}
      >
        {lineAccent}
      </div>
      <div
        style={{
          fontFamily: pixelFont,
          fontSize: 34,
          lineHeight: 1.7,
          textAlign: "center",
          color: "white",
          textShadow: "0 0 14px rgba(255,255,255,0.85), 0 4px 18px rgba(0,0,0,0.7)",
        }}
      >
        {lineWhite}
      </div>
    </div>
  );
};
