import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Anton";
import { getHighlightColor } from "./highlightWords";

const { fontFamily } = loadFont();

// Bold centered captions, natural sentence case, with a handful of key
// words capitalized and colored (red/green) for emphasis. Positioned in the
// upper-middle band so it never competes with the lower-third cutaway UI.
const WORD_POP_DURATION = 6;

export const CaptionPage: React.FC<{
  page: TikTokPage;
  pageDurationInFrames: number;
  premountFrames: number;
  containerWidth: number;
}> = ({ page, pageDurationInFrames, premountFrames, containerWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = containerWidth;

  // frame 0 is `premountFrames` before the page's official start (the
  // crossfade pre-roll), so shift back to real elapsed time since that
  // official start before mapping to absolute word timestamps.
  const currentTimeMs = ((frame - premountFrames) / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const enter = interpolate(frame, [0, 9], [0, 1], {
    easing: Easing.out(Easing.back(3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enterY = interpolate(frame, [0, 9], [50, 0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [pageDurationInFrames - 6, pageDurationInFrames],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // The outgoing page slides up and out while the incoming one slides up
  // into place from below, so during the brief crossfade overlap the two
  // pages don't just sit stacked on top of each other.
  const exitY = interpolate(
    frame,
    [pageDurationInFrames - 6, pageDurationInFrames],
    [0, -36],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const fontSize = Math.round(width * 0.082);

  return (
    <div
      style={{
        position: "absolute",
        left: "9%",
        right: "9%",
        top: "52%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          lineHeight: 1.12,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          transform: `scale(${enter * exit}) translateY(${enterY + exitY}px)`,
          transformOrigin: "center center",
          opacity: exit,
          color: "white",
          WebkitTextStroke: "1px rgba(0,0,0,0.55)",
          paintOrder: "stroke fill",
          textShadow: "0 6px 22px rgba(0,0,0,0.7)",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const wasSpoken = token.toMs <= absoluteTimeMs;
          const highlightColor = getHighlightColor(token.text);

          const tokenStartFrame =
            Math.round(((token.fromMs - page.startMs) / 1000) * fps) +
            premountFrames;
          const framesSinceStart = frame - tokenStartFrame;
          const pop =
            framesSinceStart >= 0 && framesSinceStart < WORD_POP_DURATION
              ? interpolate(
                  framesSinceStart,
                  [0, 2, WORD_POP_DURATION],
                  [1, 1.35, 1],
                  {
                    easing: Easing.out(Easing.back(3)),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )
              : 1;

          // The separating space is rendered as its own text node (not
          // inside the inline-block span) so the browser has an actual
          // break opportunity between words and can wrap onto a new line.
          return (
            <span key={token.fromMs}>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "0.28em",
                  transform: `scale(${pop})`,
                  textTransform: highlightColor ? "uppercase" : "none",
                  color: highlightColor ?? "white",
                  textShadow: highlightColor
                    ? `0 0 22px ${highlightColor}, 0 6px 18px rgba(0,0,0,0.75)`
                    : isActive
                      ? "0 0 20px rgba(255,255,255,0.9), 0 6px 22px rgba(0,0,0,0.7)"
                      : undefined,
                  opacity: wasSpoken || isActive ? 1 : 0.78,
                }}
              >
                {token.text.trimStart()}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
