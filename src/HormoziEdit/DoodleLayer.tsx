import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { DOODLE_BEATS } from "./beats";
import type { DoodleBeat } from "./beats";
import { Doodle } from "./Doodle";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// Doodles are big and clearly visible in the upper band, on top of the
// still-playing video - NOT tucked into a tiny corner. Captions live lower
// (starting ~52% down) so the two never overlap.
export const DoodleLayer: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {DOODLE_BEATS.map((beat, index) => {
        const from = msToFrame(beat.startMs, fps);
        const durationFrames = msToFrame(beat.endMs, fps) - from;
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationFrames}
            layout="none"
            name={`Doodle ${beat.kind}`}
          >
            <AbsoluteFill
              style={{
                justifyContent: "flex-start",
                alignItems: beat.side === "left" ? "flex-start" : "flex-end",
                padding: "10% 4%",
              }}
            >
              <div style={{ width: 320 }}>
                <DoodleFrameReader beat={beat} durationFrames={durationFrames} />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

// Small wrapper so Doodle can read the current frame relative to its own Sequence.
const DoodleFrameReader: React.FC<{ beat: DoodleBeat; durationFrames: number }> = ({
  beat,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  return <Doodle beat={beat} frame={frame} durationFrames={durationFrames} />;
};
