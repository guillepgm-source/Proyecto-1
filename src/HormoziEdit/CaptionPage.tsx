import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

// Clean glowing white captions, no per-word highlight chip - the active
// word instead pops in a bright accent glow, closer to the reference style.
const ACCENT = "#39FF88";
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
        top: "60%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          lineHeight: 1.15,
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          scale: `${enter * exit}`,
          translate: `0px ${enterY + exitY}px`,
          opacity: exit,
          color: "white",
          WebkitTextStroke: `${Math.max(1.5, fontSize * 0.025)}px rgba(0,0,0,0.75)`,
          paintOrder: "stroke fill",
          textShadow: "0 6px 22px rgba(0,0,0,0.7)",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const wasSpoken = token.toMs <= absoluteTimeMs;

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
                  scale: `${pop}`,
                  color: isActive ? ACCENT : "white",
                  textShadow: isActive
                    ? `0 0 16px ${ACCENT}, 0 0 34px ${ACCENT}`
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
