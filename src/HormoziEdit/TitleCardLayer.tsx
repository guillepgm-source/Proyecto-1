import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { TitleCardBeat } from "./beats";
import { TitleCard } from "./TitleCard";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const TitleCardLayer: React.FC<{ beats: TitleCardBeat[] }> = ({ beats }) => {
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
            name={`Title ${beat.lineAccent}`}
          >
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: "-8%" }}>
              <TitleCard
                lineAccent={beat.lineAccent}
                lineWhite={beat.lineWhite}
                durationFrames={durationFrames}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
