import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { CUTAWAY_BEATS } from "./beats";
import { KcalCutaway, ZoneCutaway } from "./Cutaway";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

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
              ) : (
                <KcalCutaway durationFrames={durationFrames} />
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
