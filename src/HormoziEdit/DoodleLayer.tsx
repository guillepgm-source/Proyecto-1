import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { DOODLE_BEATS } from "./beats";
import type { DoodleBeat } from "./beats";
import { Doodle } from "./Doodle";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// Doodles anchor to the bottom corners (graphics live up top, captions sit
// in the middle band), so the three overlay layers never fight for the same
// space and everything stays safely inside the 1920x1080 canvas.
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
                justifyContent: "flex-end",
                alignItems: beat.side === "left" ? "flex-start" : "flex-end",
                padding: "4% 3%",
              }}
            >
              <div style={{ width: 150 }}>
                <DoodleFrameReader kind={beat.kind} durationFrames={durationFrames} />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

// Small wrapper so Doodle can read the current frame relative to its own Sequence.
const DoodleFrameReader: React.FC<{ kind: DoodleBeat["kind"]; durationFrames: number }> = ({
  kind,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  return <Doodle kind={kind} frame={frame} durationFrames={durationFrames} />;
};
