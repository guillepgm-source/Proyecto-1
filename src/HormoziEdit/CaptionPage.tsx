import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

const HIGHLIGHT_BG = "#FFE100";

export const CaptionPage: React.FC<{
  page: TikTokPage;
  pageDurationInFrames: number;
}> = ({ page, pageDurationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const enter = interpolate(frame, [0, 6], [0, 1], {
    easing: Easing.out(Easing.back(1.8)),
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

  const fontSize = Math.round(width * 0.09);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "62%",
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

          return (
            <span
              key={token.fromMs}
              style={{
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
