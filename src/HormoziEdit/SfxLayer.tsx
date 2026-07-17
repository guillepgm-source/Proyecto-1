import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { SfxBeat } from "./beats";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// Global trim on top of each beat's own volume - they were landing too loud
// overall, so pull everything down together instead of re-tuning every beat.
const VOLUME_SCALE = 0.4;

// One-shot sound effects (synthesized locally, no stock library available)
// layered sparingly under the punchiest moments - title card, graphic
// reveals, and a couple of the hardest cuts. Not on every cut, so it stays
// snappy instead of grating.
export const SfxLayer: React.FC<{ beats: SfxBeat[] }> = ({ beats }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {beats.map((beat, index) => (
        <Sequence
          key={index}
          from={msToFrame(beat.atMs, fps)}
          durationInFrames={30}
          layout="none"
          name={`Sfx ${beat.src}`}
        >
          <Audio
            src={staticFile(`audio/${beat.src}.wav`)}
            volume={() => (beat.volume ?? 0.55) * VOLUME_SCALE}
          />
        </Sequence>
      ))}
    </>
  );
};
