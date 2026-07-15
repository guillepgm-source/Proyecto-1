import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { HIGHLIGHT_RED } from "./highlightWords";

const { fontFamily } = loadFont();

// A big bold-sans title card, matching devinjatho's format exactly: plain
// white caps for the setup line, a red highlight box behind the punchline -
// no pixel font, no thin accent line, just the same look used everywhere
// else in his edits (e.g. "and that's EXACTLY").
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
  const boxGrow = interpolate(frame, [6, 16], [0, 1], {
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
        gap: 6,
        opacity: enter * exit,
        transform: `scale(${0.85 + enter * 0.15})`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 46,
          lineHeight: 1.15,
          textAlign: "center",
          color: "white",
          textShadow:
            "0 0 14px rgba(255,255,255,0.6), 0 4px 18px rgba(0,0,0,0.8)",
        }}
      >
        {lineWhite}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 46,
          lineHeight: 1.15,
          textAlign: "center",
          color: "white",
          background: HIGHLIGHT_RED,
          padding: "4px 18px",
          borderRadius: 6,
          transform: `scaleX(${Math.max(boxGrow, 0.001)})`,
        }}
      >
        {lineAccent}
      </div>
    </div>
  );
};
