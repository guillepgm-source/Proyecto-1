import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

const HIGHLIGHT_BG = "#FFE100";
const WORD_POP_DURATION = 6;

export const CaptionPage: React.FC<{
  page: TikTokPage;
  pageDurationInFrames: number;
  containerWidth: number;
}> = ({ page, pageDurationInFrames, containerWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = containerWidth;

  const currentTimeMs = (frame / fps) * 1000;
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
    [pageDurationInFrames - 4, pageDurationInFrames],
    [1, 0],
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
          translate: `0px ${enterY}px`,
          opacity: exit,
          color: "white",
          WebkitTextStroke: `${Math.max(2, fontSize * 0.045)}px black`,
          paintOrder: "stroke fill",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const wasSpoken = token.toMs <= absoluteTimeMs;

          const tokenStartFrame = Math.round(
            ((token.fromMs - page.startMs) / 1000) * fps,
          );
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
                  backgroundColor: isActive ? HIGHLIGHT_BG : "transparent",
                  color: isActive ? "black" : "white",
                  WebkitTextStroke: isActive
                    ? "0px transparent"
                    : `${Math.max(2, fontSize * 0.045)}px black`,
                  borderRadius: 8,
                  padding: isActive ? "0.05em 0.14em" : undefined,
                  opacity: wasSpoken || isActive ? 1 : 0.82,
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
