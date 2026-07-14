import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SFX_BEATS } from "./beats";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// One-shot sound effects (synthesized locally, no stock library available)
// layered sparingly under the punchiest moments - title card, graphic
// reveals, and a couple of the hardest cuts. Not on every cut, so it stays
// snappy instead of grating.
export const SfxLayer: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {SFX_BEATS.map((beat, index) => (
        <Sequence
          key={index}
          from={msToFrame(beat.atMs, fps)}
          durationInFrames={30}
          layout="none"
          name={`Sfx ${beat.src}`}
        >
          <Audio
            src={staticFile(`audio/${beat.src}.wav`)}
            volume={() => beat.volume ?? 0.55}
          />
        </Sequence>
      ))}
    </>
  );
};
