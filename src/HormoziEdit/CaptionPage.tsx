import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

const HIGHLIGHT_BG = "#FFE100";
const WORD_POP_DURATION = 6;

export const CaptionPage: React.FC<{
  page: TikTokPage;
  pageDurationInFrames: number;
}> = ({ page, pageDurationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

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

  const fontSize = Math.round(width * 0.1);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "60%",
        display: "flex",
        justifyContent: "center",
        padding: "0 6%",
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

          return (
            <span
              key={token.fromMs}
              style={{
                display: "inline-block",
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
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
