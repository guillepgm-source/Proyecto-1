import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { CutawayBeat } from "./beats";
import { FlashCutaway, KcalCutaway, TransformCutaway, ZoneCutaway } from "./Cutaway";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const FLASH_COLORS = { red: "#FF4D4D", green: "#39FF88" };

// Real "cut to black" cutaways: the talking-head video is fully covered by
// an opaque animated explainer scene (its audio keeps playing underneath),
// mimicking the camera cuts in the reference edit instead of a small
// corner overlay on top of the continuous shot.
export const CutawayLayer: React.FC<{ beats: CutawayBeat[] }> = ({ beats }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {beats.map((beat, index) => {
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
              ) : beat.kind === "transformCutaway" ? (
                <TransformCutaway
                  durationFrames={durationFrames}
                  label={beat.label}
                  after={beat.after}
                  color={beat.color ? FLASH_COLORS[beat.color] : undefined}
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
  beats: CutawayBeat[],
): boolean => beats.some((beat) => nowMs >= beat.startMs && nowMs < beat.endMs);
