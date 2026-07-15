import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { CUTAWAY_BEATS } from "./beats";
import {
  ArrowCutaway,
  FlashCutaway,
  KcalCutaway,
  TransformCutaway,
  ZoneCutaway,
} from "./Cutaway";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const FLASH_COLORS = { red: "#FF4D4D", green: "#39FF88" };

// Real "cut to black" cutaways: the talking-head video is fully covered by
// an opaque animated explainer scene (its audio keeps playing underneath),
// mimicking the camera cuts in the reference edit instead of a small
// corner overlay on top of the continuous shot.
export const CutawayLayer: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {CUTAWAY_BEATS.map((beat, index) => {
        const from = msToFrame(beat.startMs, fps);
        const durationFrames = msToFrame(beat.endMs, fps) - from;
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationFrames}
            layout="none"
            name={`Cutaway ${beat.kind}`}
          >
            <AbsoluteFill style={{ backgroundColor: "#050505" }}>
              {beat.kind === "zoneCutaway" ? (
                <ZoneCutaway durationFrames={durationFrames} />
              ) : beat.kind === "kcalCutaway" ? (
                <KcalCutaway durationFrames={durationFrames} />
              ) : beat.kind === "arrowCutaway" ? (
                <ArrowCutaway
                  durationFrames={durationFrames}
                  label={beat.label}
                  color={FLASH_COLORS[beat.color]}
                  rotate={beat.rotate}
                />
              ) : beat.kind === "transformCutaway" ? (
                <TransformCutaway
                  durationFrames={durationFrames}
                  label={beat.label}
                />
              ) : (
                <FlashCutaway
                  durationFrames={durationFrames}
                  text={beat.text}
                  color={FLASH_COLORS[beat.color]}
                  icon={beat.icon}
                />
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

export const isCutawayActive = (
  nowMs: number,
): boolean =>
  CUTAWAY_BEATS.some((beat) => nowMs >= beat.startMs && nowMs < beat.endMs);
